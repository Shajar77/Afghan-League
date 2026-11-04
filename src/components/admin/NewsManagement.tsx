import { useState, useEffect, useCallback, useRef } from 'react'
import { buildApiUrl, authFetch, normalizeMediaUrl } from '../../config/api'
import { compressImageFile } from '../../utils/imageCompression'
import {
  Newspaper,
  Plus,
  Pencil,
  Trash2,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Calendar,
  Tag,
  User,
  Image as ImageIcon,
  ChevronDown,
  FileText,
  Upload,
  Link
} from 'lucide-react'
import './NewsManagement.css'
import { RichTextEditor } from './RichTextEditor'
import { stripHtml, invalidateNewsCache } from '../../hooks/useNewsArticles'

interface PRRecord {
  id: number | string
  maintitle?: string
  title?: string
  description?: string
  author?: string
  category?: string
  prdate?: string
  imageurl?: string
  created_at?: string
  updated_at?: string
}

interface FormState {
  maintitle: string
  title: string
  description: string
  author: string
  category: string
  prdate: string
  imageurl: string
}

const EMPTY_FORM: FormState = {
  maintitle: '',
  title: '',
  description: '',
  author: '',
  category: '',
  prdate: new Date().toISOString().split('T')[0],
  imageurl: ''
}

const CATEGORIES = [
  'Announcements',
  'Tournament',
  'Press Release',
  'Player News',
  'Team News',
  'Match Report',
  'General'
]

interface NewsManagementProps {
  onLogout?: () => void
}

export function NewsManagement({ onLogout }: NewsManagementProps) {
  const [articles, setArticles] = useState<PRRecord[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [deletingId, setDeletingId] = useState<number | string | null>(null)

  const [view, setView] = useState<'list' | 'form'>('list')
  const [editingArticle, setEditingArticle] = useState<PRRecord | null>(null)
  const [form, setForm] = useState<FormState>(EMPTY_FORM)
  const [errors, setErrors] = useState<Partial<FormState>>({})

  const [isUploadingImage, setIsUploadingImage] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [imageLoadError, setImageLoadError] = useState(false)
  const imageInputRef = useRef<HTMLInputElement>(null)

  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null)
  const [confirmDeleteId, setConfirmDeleteId] = useState<number | string | null>(null)

  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showToast = (msg: string, type: 'success' | 'error') => {
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current)
    setToast({ msg, type })
    toastTimerRef.current = setTimeout(() => setToast(null), 4000)
  }

  // Image upload handler
  const handleImageUpload = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      showToast('Please select an image file.', 'error')
      return
    }
    setIsUploadingImage(true)
    setImageLoadError(false)
    try {
      const compressed = await compressImageFile(file, { maxSizeMB: 1, maxWidthOrHeight: 1920 })
      const formData = new FormData()
      formData.append('file', compressed)
      const res = await authFetch(buildApiUrl('/uploads/image'), {
        method: 'POST',
        body: formData
      })
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || 'Upload failed.')
      }
      const json = await res.json()
      // Try common response shapes for the returned URL
      const rawUrl = json.url || json.imageUrl || json.image_url || json.data?.url || json.data?.imageUrl || json.data?.file_url || ''
      if (!rawUrl) throw new Error('No URL returned from server.')
      const fullUrl = normalizeMediaUrl(rawUrl) || rawUrl
      handleField('imageurl', fullUrl)
      showToast('Image uploaded successfully!', 'success')
    } catch (err: any) {
      showToast(err.message || 'Image upload failed.', 'error')
    } finally {
      setIsUploadingImage(false)
    }
  }

  const fetchArticles = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await authFetch(buildApiUrl('/prinfo'))
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) { showToast('Failed to load articles.', 'error'); return }
      const json = await res.json()
      const list: PRRecord[] = Array.isArray(json)
        ? json
        : (json.data?.records || json.data || json.records || json.prinfo || [])
      list.sort((a, b) => {
        const da = new Date(a.prdate || '').getTime() || 0
        const db = new Date(b.prdate || '').getTime() || 0
        if (db !== da) return db - da

        const ca = new Date(a.created_at || (a as any).createdAt || '').getTime() || 0
        const cb = new Date(b.created_at || (b as any).createdAt || '').getTime() || 0
        if (cb !== ca) return cb - ca

        const idA = Number(a.id) || 0
        const idB = Number(b.id) || 0
        return idB - idA
      })
      setArticles(list)
    } catch {
      showToast('Network error loading articles.', 'error')
    } finally {
      setIsLoading(false)
    }
  }, [onLogout])

  useEffect(() => { fetchArticles() }, [fetchArticles])

  const openCreate = () => {
    setEditingArticle(null)
    setForm(EMPTY_FORM)
    setErrors({})
    setView('form')
  }

  const openEdit = (article: PRRecord) => {
    setEditingArticle(article)
    setForm({
      maintitle: article.maintitle || '',
      title: article.title || '',
      description: article.description || '',
      author: article.author || '',
      category: article.category || '',
      prdate: article.prdate ? article.prdate.split('T')[0] : new Date().toISOString().split('T')[0],
      imageurl: article.imageurl || ''
    })
    setErrors({})
    setView('form')
  }

  const cancelForm = () => {
    setView('list')
    setEditingArticle(null)
    setForm(EMPTY_FORM)
    setErrors({})
  }

  const handleField = (key: keyof FormState, val: string) => {
    setForm(prev => ({ ...prev, [key]: val }))
    if (key === 'imageurl') setImageLoadError(false)
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: '' }))
  }

  const validate = (): boolean => {
    const errs: Partial<FormState> = {}
    if (!form.title.trim()) errs.title = 'Title is required'
    if (!form.description.trim()) errs.description = 'Article content is required'
    if (!form.category) errs.category = 'Category is required'
    if (!form.prdate) errs.prdate = 'Date is required'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async () => {
    if (!validate()) return
    setIsSubmitting(true)
    const payload = {
      maintitle: form.maintitle.trim() || form.title.trim(),
      title: form.title.trim(),
      description: form.description.trim(),
      author: form.author.trim() || 'APL Media Team',
      category: form.category,
      prdate: form.prdate,
      imageurl: normalizeMediaUrl(form.imageurl.trim()) || form.imageurl.trim()
    }
    try {
      const isEdit = !!editingArticle
      const url = isEdit ? buildApiUrl(`/prinfo/${editingArticle!.id}`) : buildApiUrl('/prinfo')
      const res = await authFetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.message || err.error?.message || 'Save failed.')
      }
      invalidateNewsCache()
      showToast(isEdit ? 'Article updated!' : 'Article published!', 'success')
      setView('list')
      setEditingArticle(null)
      setForm(EMPTY_FORM)
      fetchArticles()
    } catch (err: any) {
      showToast(err.message || 'Failed to save article.', 'error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (id: number | string) => {
    setDeletingId(id)
    setConfirmDeleteId(null)
    try {
      const res = await authFetch(buildApiUrl(`/prinfo/${id}`), { method: 'DELETE' })
      if (res.status === 401 && onLogout) { onLogout(); return }
      if (!res.ok) throw new Error('Delete failed.')
      invalidateNewsCache()
      setArticles(prev => prev.filter(a => a.id !== id))
      showToast('Article deleted.', 'success')
    } catch {
      showToast('Failed to delete article.', 'error')
    } finally {
      setDeletingId(null)
    }
  }

  const filtered = articles.filter(a => {
    const q = search.toLowerCase()
    const matchSearch = !q ||
      (a.title || '').toLowerCase().includes(q) ||
      (a.maintitle || '').toLowerCase().includes(q) ||
      (a.description || '').toLowerCase().includes(q) ||
      (a.author || '').toLowerCase().includes(q)
    const matchCat = categoryFilter === 'All' || a.category === categoryFilter
    return matchSearch && matchCat
  })

  const uniqueCategories = ['All', ...Array.from(new Set(articles.map(a => a.category).filter(Boolean) as string[]))]

  const formatDate = (d?: string) => {
    if (!d) return '—'
    const date = new Date(d)
    if (isNaN(date.getTime())) return d
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
  }

  return (
    <div className="apl-nm-wrapper">

      {/* Toast */}
      {toast && (
        <div className={`apl-nm-toast apl-nm-toast--${toast.type}`}>
          {toast.type === 'success' ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
          <span>{toast.msg}</span>
          <button type="button" className="apl-nm-toast-close" onClick={() => setToast(null)}>
            <X size={14} />
          </button>
        </div>
      )}

      {/* Delete Confirm Modal */}
      {confirmDeleteId !== null && (
        <div className="apl-nm-modal-overlay" onClick={() => setConfirmDeleteId(null)}>
          <div className="apl-nm-modal" onClick={e => e.stopPropagation()}>
            <button
              type="button"
              className="apl-nm-modal-close"
              onClick={() => setConfirmDeleteId(null)}
              title="Close"
              aria-label="Close"
            >
              <X size={18} />
            </button>
            <div className="apl-nm-modal-icon"><Trash2 size={26} /></div>
            <h3 className="apl-nm-modal-title">Delete Article?</h3>
            <p className="apl-nm-modal-desc">This action cannot be undone. The article will be permanently removed.</p>
            <div className="apl-nm-modal-actions">
              <button type="button" className="apl-nm-btn apl-nm-btn--ghost" onClick={() => setConfirmDeleteId(null)}>Cancel</button>
              <button type="button" className="apl-nm-btn apl-nm-btn--danger" onClick={() => handleDelete(confirmDeleteId)}>Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Page Header */}
      <header className="apl-nm-header">
        <div className="apl-nm-title-wrap">
          <h1 className="apl-nm-title">
            NEWS & BLOGS <span className="gold-text">MANAGEMENT</span>
          </h1>
          <p className="apl-nm-sub">Create, edit and publish news articles and press releases</p>
        </div>
        <div className="apl-nm-header-actions">
          {view === 'list' ? (
            <>
              <button type="button" className="apl-nm-icon-btn" onClick={fetchArticles} disabled={isLoading} title="Refresh">
                <RefreshCw size={16} className={isLoading ? 'apl-nm-spin' : ''} />
              </button>
              <button type="button" className="apl-nm-btn apl-nm-btn--primary" onClick={openCreate}>
                <Plus size={16} /> New Article
              </button>
            </>
          ) : (
            <button type="button" className="apl-nm-btn apl-nm-btn--ghost" onClick={cancelForm}>
              <X size={16} /> Cancel
            </button>
          )}
        </div>
      </header>

      {/* LIST VIEW */}
      {view === 'list' && (
        <div className="apl-nm-list-view">
          <div className="apl-nm-filters">
            <div className="apl-nm-search-wrap">
              <Search size={15} className="apl-nm-search-icon" />
              <input
                type="text"
                className="apl-nm-search-input"
                placeholder="Search articles..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              {search && (
                <button type="button" className="apl-nm-search-clear" onClick={() => setSearch('')}>
                  <X size={13} />
                </button>
              )}
            </div>
            <div className="apl-nm-select-wrap">
              <Tag size={14} className="apl-nm-select-icon-left" />
              <select className="apl-nm-select" value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)}>
                {uniqueCategories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <ChevronDown size={14} className="apl-nm-select-icon-right" />
            </div>
          </div>

          {isLoading && (
            <div className="apl-nm-state-box">
              <Loader2 size={28} className="apl-nm-spin" style={{ color: '#0575E6' }} />
              <span>Loading articles...</span>
            </div>
          )}

          {!isLoading && filtered.length === 0 && (
            <div className="apl-nm-state-box apl-nm-state-box--empty">
              <Newspaper size={44} style={{ opacity: 0.25 }} />
              <p>{search || categoryFilter !== 'All' ? 'No articles match your search.' : 'No articles yet. Create your first one!'}</p>
              {!search && categoryFilter === 'All' && (
                <button type="button" className="apl-nm-btn apl-nm-btn--primary" onClick={openCreate}>
                  <Plus size={15} /> Create Article
                </button>
              )}
            </div>
          )}

          {!isLoading && filtered.length > 0 && (
            <div className="apl-nm-cards">
              {filtered.map(article => (
                <div key={article.id} className="apl-nm-card">
                  <div className="apl-nm-card-thumb">
                    {article.imageurl
                      ? <img src={normalizeMediaUrl(article.imageurl)} alt={article.title} loading="lazy" />
                      : <div className="apl-nm-card-thumb-placeholder"><FileText size={28} style={{ opacity: 0.3 }} /></div>}
                  </div>
                  <div className="apl-nm-card-body">
                    <div className="apl-nm-card-meta">
                      {article.category && <span className="apl-nm-cat-badge">{article.category}</span>}
                      <span className="apl-nm-card-date"><Calendar size={12} />{formatDate(article.prdate || article.created_at)}</span>
                      {article.author && <span className="apl-nm-card-author"><User size={12} />{article.author}</span>}
                    </div>
                    {article.maintitle && <p className="apl-nm-card-maintitle">{article.maintitle}</p>}
                    <h3 className="apl-nm-card-title">{article.title || '(No title)'}</h3>
                    {article.description && (() => {
                      const clean = stripHtml(article.description)
                      return (
                        <p className="apl-nm-card-excerpt">
                          {clean.slice(0, 160)}{clean.length > 160 ? '…' : ''}
                        </p>
                      )
                    })()}
                  </div>
                  <div className="apl-nm-card-actions">
                    <button type="button" className="apl-nm-action-btn apl-nm-action-btn--edit" onClick={() => openEdit(article)}>
                      <Pencil size={15} /> Edit
                    </button>
                    <button
                      type="button"
                      className="apl-nm-action-btn apl-nm-action-btn--delete"
                      onClick={() => setConfirmDeleteId(article.id)}
                      disabled={deletingId === article.id}
                    >
                      {deletingId === article.id ? <Loader2 size={15} className="apl-nm-spin" /> : <Trash2 size={15} />}
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* FORM VIEW */}
      {view === 'form' && (
        <div className="apl-nm-form-view">
          <div className="apl-nm-form-card">
            <div className="apl-nm-form-card-header">
              <div className="apl-nm-form-icon">
                {editingArticle ? <Pencil size={20} /> : <Plus size={20} />}
              </div>
              <div>
                <h2 className="apl-nm-form-title">{editingArticle ? 'Edit Article' : 'Create New Article'}</h2>
                <p className="apl-nm-form-sub">{editingArticle ? 'Update the article details below' : 'Fill in the details to publish a new article'}</p>
              </div>
            </div>

            <div className="apl-nm-form-body">
              <div className="apl-nm-field">
                <label className="apl-nm-label"><Tag size={13} /> Section / Main Title <span className="apl-nm-label-opt">(optional)</span></label>
                <input type="text" className="apl-nm-input" placeholder="e.g. Official Announcement" value={form.maintitle} onChange={e => handleField('maintitle', e.target.value)} />
                <span className="apl-nm-hint">Appears as a small label above the headline</span>
              </div>

              <div className="apl-nm-field">
                <label className="apl-nm-label"><FileText size={13} /> Article Title <span className="apl-nm-required">*</span></label>
                <input type="text" className={`apl-nm-input ${errors.title ? 'error' : ''}`} placeholder="e.g. APL Season 3 Tournament Dates Confirmed" value={form.title} onChange={e => handleField('title', e.target.value)} />
                {errors.title && <span className="apl-nm-field-error">{errors.title}</span>}
              </div>

              <div className="apl-nm-form-row">
                <div className="apl-nm-field">
                  <label className="apl-nm-label"><Tag size={13} /> Category <span className="apl-nm-required">*</span></label>
                  <div className="apl-nm-select-field-wrap">
                    <select className={`apl-nm-select apl-nm-select--field ${errors.category ? 'error' : ''}`} value={form.category} onChange={e => handleField('category', e.target.value)}>
                      <option value="">Select category...</option>
                      {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <ChevronDown size={14} className="apl-nm-select-icon-right" />
                  </div>
                  {errors.category && <span className="apl-nm-field-error">{errors.category}</span>}
                </div>
                <div className="apl-nm-field">
                  <label className="apl-nm-label"><Calendar size={13} /> Publish Date <span className="apl-nm-required">*</span></label>
                  <input type="date" className={`apl-nm-input ${errors.prdate ? 'error' : ''}`} value={form.prdate} onChange={e => handleField('prdate', e.target.value)} />
                  {errors.prdate && <span className="apl-nm-field-error">{errors.prdate}</span>}
                </div>
              </div>

              <div className="apl-nm-field">
                <label className="apl-nm-label"><User size={13} /> Author <span className="apl-nm-label-opt">(optional)</span></label>
                <input type="text" className="apl-nm-input" placeholder="e.g. APL Media Team" value={form.author} onChange={e => handleField('author', e.target.value)} />
              </div>

              <div className="apl-nm-field">
                <label className="apl-nm-label"><ImageIcon size={13} /> Cover Image <span className="apl-nm-label-opt">(optional)</span></label>

                {/* Drop Zone */}
                <div
                  className={`apl-nm-drop-zone ${dragOver ? 'drag-over' : ''} ${form.imageurl ? 'has-image' : ''}`}
                  onDragOver={e => { e.preventDefault(); setDragOver(true) }}
                  onDragLeave={() => setDragOver(false)}
                  onDrop={e => {
                    e.preventDefault()
                    setDragOver(false)
                    const file = e.dataTransfer.files[0]
                    if (file) handleImageUpload(file)
                  }}
                  onClick={() => !form.imageurl && imageInputRef.current?.click()}
                >
                  <input
                    ref={imageInputRef}
                    type="file"
                    accept="image/*"
                    style={{ display: 'none' }}
                    onChange={e => {
                      const file = e.target.files?.[0]
                      if (file) handleImageUpload(file)
                      e.target.value = ''
                    }}
                  />

                  {isUploadingImage ? (
                    <div className="apl-nm-drop-state">
                      <Loader2 size={32} className="apl-nm-spin" style={{ color: '#0575E6' }} />
                      <span>Uploading image...</span>
                    </div>
                  ) : form.imageurl ? (
                    <div className="apl-nm-drop-preview">
                      {imageLoadError ? (
                        <div className="apl-nm-drop-img-error">
                          <ImageIcon size={28} style={{ opacity: 0.35 }} />
                          <span>Image can't be previewed</span>
                          <span className="apl-nm-hint" style={{ textAlign: 'center', maxWidth: 260 }}>
                            The URL is saved but the image couldn't load — it may require login or be a private link.
                          </span>
                          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.25rem' }}>
                            <button type="button" className="apl-nm-btn apl-nm-btn--ghost apl-nm-drop-browse"
                              onClick={e => { e.stopPropagation(); imageInputRef.current?.click() }}>
                              <Upload size={13} /> Upload instead
                            </button>
                            <button type="button" className="apl-nm-btn apl-nm-btn--ghost apl-nm-drop-browse"
                              style={{ color: '#e11d48 !important' }}
                              onClick={e => { e.stopPropagation(); handleField('imageurl', '') }}>
                              <X size={13} /> Remove
                            </button>
                          </div>
                        </div>
                      ) : (
                        <img
                          src={normalizeMediaUrl(form.imageurl)}
                          alt="Cover"
                          loading="lazy"
                          onError={() => setImageLoadError(true)}
                        />
                      )}
                      {!imageLoadError && (
                        <>
                          <button
                            type="button"
                            className="apl-nm-drop-remove"
                            onClick={e => { e.stopPropagation(); handleField('imageurl', '') }}
                            title="Remove image"
                          >
                            <X size={16} />
                          </button>
                          <button
                            type="button"
                            className="apl-nm-drop-replace"
                            onClick={e => { e.stopPropagation(); imageInputRef.current?.click() }}
                          >
                            <Upload size={14} /> Replace
                          </button>
                        </>
                      )}
                    </div>
                  ) : (
                    <div className="apl-nm-drop-state">
                      <Upload size={32} style={{ opacity: 0.4 }} />
                      <span className="apl-nm-drop-main">Drag & drop image here</span>
                      <span className="apl-nm-drop-or">or</span>
                      <button type="button" className="apl-nm-btn apl-nm-btn--ghost apl-nm-drop-browse">
                        Browse File
                      </button>
                    </div>
                  )}
                </div>

                {/* Fallback URL input */}
                <div className="apl-nm-image-url-row">
                  <Link size={13} style={{ color: '#94a3b8', flexShrink: 0 }} />
                  <input
                    type="url"
                    className="apl-nm-input apl-nm-input--sm"
                    placeholder="Or paste image URL directly..."
                    value={form.imageurl}
                    onChange={e => handleField('imageurl', e.target.value)}
                  />
                </div>
              </div>

              <div className="apl-nm-field">
                <label className="apl-nm-label"><FileText size={13} /> Article Content <span className="apl-nm-required">*</span></label>
                <RichTextEditor
                  value={form.description}
                  onChange={val => handleField('description', val)}
                  placeholder="Write the full article content here..."
                  hasError={!!errors.description}
                />
                {errors.description && <span className="apl-nm-field-error">{errors.description}</span>}
              </div>
            </div>

            <div className="apl-nm-form-actions">
              <button type="button" className="apl-nm-btn apl-nm-btn--ghost" onClick={cancelForm}>Cancel</button>
              <button type="button" className="apl-nm-btn apl-nm-btn--primary" onClick={handleSubmit} disabled={isSubmitting}>
                {isSubmitting
                  ? <><Loader2 size={15} className="apl-nm-spin" /> Saving...</>
                  : editingArticle
                    ? <><CheckCircle2 size={15} /> Update Article</>
                    : <><Plus size={15} /> Publish Article</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
