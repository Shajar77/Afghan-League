import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TextAlign from '@tiptap/extension-text-align'
import { TextStyle } from '@tiptap/extension-text-style'
import { Color } from '@tiptap/extension-color'
import Placeholder from '@tiptap/extension-placeholder'
import { useEffect, useCallback, useState, useRef } from 'react'
import './RichTextEditor.css'

interface RichTextEditorProps {
  value: string
  onChange: (html: string) => void
  placeholder?: string
  hasError?: boolean
}

const PRESET_COLORS = [
  { label: 'APL Gold', value: '#F8C800' },
  { label: 'Royal Blue', value: '#0575E6' },
  { label: 'Dark Navy', value: '#021B79' },
  { label: 'Pure White', value: '#FFFFFF' },
  { label: 'Charcoal', value: '#334155' },
  { label: 'Pitch Black', value: '#0F172A' },
  { label: 'Emerald Green', value: '#10B981' },
  { label: 'Ruby Red', value: '#EF4444' },
  { label: 'Sunset Orange', value: '#F97316' },
  { label: 'Warm Amber', value: '#F59E0B' },
  { label: 'Teal Cyan', value: '#06B6D4' },
  { label: 'Violet Purple', value: '#8B5CF6' },
]

// ── Toolbar Button ─────────────────────────────────────────────
function ToolbarBtn({
  onClick, active, title, disabled, children
}: {
  onClick: () => void
  active?: boolean
  title: string
  disabled?: boolean
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      className={`rte-toolbar-btn ${active ? 'is-active' : ''}`}
      onClick={onClick}
      title={title}
      disabled={disabled}
    >
      {children}
    </button>
  )
}

function Divider() {
  return <span className="rte-toolbar-divider" />
}

// ── Main Editor ────────────────────────────────────────────────
export function RichTextEditor({ value, onChange, placeholder, hasError }: RichTextEditorProps) {
  const [showColorPicker, setShowColorPicker] = useState(false)
  const colorPickerRef = useRef<HTMLDivElement>(null)

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        bulletList: { keepMarks: true },
        orderedList: { keepMarks: true },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: 'rte-link', rel: 'noopener noreferrer', target: '_blank' },
      }),
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      TextStyle,
      Color,
      Placeholder.configure({ placeholder: placeholder || 'Write the full article content here...' }),
    ],
    content: value || '',
    onUpdate({ editor }) {
      const html = editor.getHTML()
      onChange(html === '<p></p>' ? '' : html)
    },
    editorProps: {
      attributes: { class: 'rte-content' },
    },
  })

  // Sync external value changes (e.g. when editing an existing article)
  useEffect(() => {
    if (!editor) return
    const current = editor.getHTML()
    if (value !== current && !(value === '' && current === '<p></p>')) {
      editor.commands.setContent(value || '', { emitUpdate: false })
    }
  }, [value, editor])

  // Close color picker on outside click
  useEffect(() => {
    if (!showColorPicker) return
    const handleOutsideClick = (e: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(e.target as Node)) {
        setShowColorPicker(false)
      }
    }
    document.addEventListener('mousedown', handleOutsideClick)
    return () => document.removeEventListener('mousedown', handleOutsideClick)
  }, [showColorPicker])

  const setLink = useCallback(() => {
    if (!editor) return
    const prev = editor.getAttributes('link').href || ''
    const url = window.prompt('Enter URL', prev)
    if (url === null) return
    if (url === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run()
      return
    }
    editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run()
  }, [editor])

  if (!editor) return null

  const activeColor = editor.getAttributes('textStyle').color as string | undefined

  return (
    <div className={`rte-wrapper ${hasError ? 'has-error' : ''}`}>
      {/* Toolbar */}
      <div className="rte-toolbar" onMouseDown={e => {
        // Don't prevent default if interacting with inputs/selects
        const tag = (e.target as HTMLElement).tagName
        if (tag !== 'SELECT' && tag !== 'INPUT') {
          e.preventDefault()
        }
      }}>
        {/* Text style */}
        <div className="rte-toolbar-group">
          <select
            className="rte-heading-select"
            value={
              editor.isActive('heading', { level: 1 }) ? 'h1' :
              editor.isActive('heading', { level: 2 }) ? 'h2' :
              editor.isActive('heading', { level: 3 }) ? 'h3' : 'p'
            }
            onChange={e => {
              const val = e.target.value
              if (val === 'p') editor.chain().focus().setParagraph().run()
              else editor.chain().focus().toggleHeading({ level: parseInt(val[1]) as 1|2|3 }).run()
            }}
          >
            <option value="p">Paragraph</option>
            <option value="h1">Heading 1</option>
            <option value="h2">Heading 2</option>
            <option value="h3">Heading 3</option>
          </select>
        </div>

        <Divider />

        {/* Bold / Italic / Underline / Strike */}
        <div className="rte-toolbar-group">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Bold (Ctrl+B)">
            <strong>B</strong>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Italic (Ctrl+I)">
            <em>I</em>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleUnderline().run()} active={editor.isActive('underline')} title="Underline (Ctrl+U)">
            <span style={{ textDecoration: 'underline' }}>U</span>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Strikethrough">
            <span style={{ textDecoration: 'line-through' }}>S</span>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Color Picker */}
        <div className="rte-toolbar-group rte-color-picker-wrapper" ref={colorPickerRef}>
          <button
            type="button"
            className={`rte-toolbar-btn rte-color-btn ${showColorPicker || !!activeColor ? 'is-active' : ''}`}
            onClick={() => setShowColorPicker(v => !v)}
            title="Text Color"
          >
            <span className="rte-color-btn-inner">
              <span className="rte-color-letter">A</span>
              <span
                className="rte-color-indicator"
                style={{ backgroundColor: activeColor || '#0575E6' }}
              />
            </span>
          </button>

          {showColorPicker && (
            <div className="rte-color-popover" onMouseDown={e => e.stopPropagation()}>
              <div className="rte-color-header">
                <span className="rte-color-header-title">Text Color</span>
                {activeColor && (
                  <button
                    type="button"
                    className="rte-color-clear-btn"
                    onClick={() => {
                      editor.chain().focus().unsetColor().run()
                      setShowColorPicker(false)
                    }}
                  >
                    Reset
                  </button>
                )}
              </div>
              <div className="rte-color-grid">
                {PRESET_COLORS.map(c => (
                  <button
                    key={c.value}
                    type="button"
                    className={`rte-color-swatch ${activeColor?.toLowerCase() === c.value.toLowerCase() ? 'is-selected' : ''}`}
                    style={{ backgroundColor: c.value }}
                    onClick={() => {
                      editor.chain().focus().setColor(c.value).run()
                      setShowColorPicker(false)
                    }}
                    title={c.label}
                  />
                ))}
              </div>
              <div className="rte-color-custom">
                <label className="rte-color-custom-label">
                  <input
                    type="color"
                    className="rte-color-native-input"
                    value={activeColor || '#0575e6'}
                    onChange={e => {
                      editor.chain().focus().setColor(e.target.value).run()
                    }}
                  />
                  <span>Custom Color Picker</span>
                </label>
              </div>
            </div>
          )}
        </div>

        <Divider />

        {/* Lists */}
        <div className="rte-toolbar-group">
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Bullet List">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/>
              <circle cx="3" cy="6" r="1.5" fill="currentColor"/><circle cx="3" cy="12" r="1.5" fill="currentColor"/><circle cx="3" cy="18" r="1.5" fill="currentColor"/>
            </svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Numbered List">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="10" y1="6" x2="21" y2="6"/><line x1="10" y1="12" x2="21" y2="12"/><line x1="10" y1="18" x2="21" y2="18"/>
              <path d="M4 6h1v4M4 10h2" strokeWidth="1.8"/><path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1" strokeWidth="1.8"/>
            </svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Blockquote">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"/>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"/>
            </svg>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Text Alignment */}
        <div className="rte-toolbar-group">
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('left').run()} active={editor.isActive({ textAlign: 'left' })} title="Align Left">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="15" y2="12"/><line x1="3" y1="18" x2="18" y2="18"/>
            </svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('center').run()} active={editor.isActive({ textAlign: 'center' })} title="Center">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="6" y1="12" x2="18" y2="12"/><line x1="4" y1="18" x2="20" y2="18"/>
            </svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().setTextAlign('right').run()} active={editor.isActive({ textAlign: 'right' })} title="Align Right">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="3" y1="6" x2="21" y2="6"/><line x1="9" y1="12" x2="21" y2="12"/><line x1="6" y1="18" x2="21" y2="18"/>
            </svg>
          </ToolbarBtn>
        </div>

        <Divider />

        {/* Link */}
        <div className="rte-toolbar-group">
          <ToolbarBtn onClick={setLink} active={editor.isActive('link')} title="Insert / Edit Link">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/>
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>
            </svg>
          </ToolbarBtn>
          {editor.isActive('link') && (
            <ToolbarBtn onClick={() => editor.chain().focus().unsetLink().run()} title="Remove Link">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18.84 12.25l1.72-1.71h-.02a5.004 5.004 0 0 0-.12-7.07 5.006 5.006 0 0 0-6.95 0l-1.72 1.71"/>
                <path d="M5.17 11.75l-1.71 1.71a5.004 5.004 0 0 0 .12 7.07 5.006 5.006 0 0 0 6.95 0l1.71-1.71"/>
                <line x1="8" y1="2" x2="8" y2="5"/><line x1="2" y1="8" x2="5" y2="8"/>
                <line x1="16" y1="19" x2="16" y2="22"/><line x1="19" y1="16" x2="22" y2="16"/>
              </svg>
            </ToolbarBtn>
          )}
        </div>

        <Divider />

        {/* Undo / Redo */}
        <div className="rte-toolbar-group">
          <ToolbarBtn onClick={() => editor.chain().focus().undo().run()} disabled={!editor.can().undo()} title="Undo (Ctrl+Z)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 14 4 9 9 4"/><path d="M20 20v-7a4 4 0 0 0-4-4H4"/>
            </svg>
          </ToolbarBtn>
          <ToolbarBtn onClick={() => editor.chain().focus().redo().run()} disabled={!editor.can().redo()} title="Redo (Ctrl+Y)">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 14 20 9 15 4"/><path d="M4 20v-7a4 4 0 0 1 4-4h12"/>
            </svg>
          </ToolbarBtn>
        </div>

        {/* Word count */}
        <span className="rte-wordcount">
          {editor.storage.characterCount?.words?.() ?? editor.getText().split(/\s+/).filter(Boolean).length} words
        </span>
      </div>

      {/* Editor area */}
      <EditorContent editor={editor} className="rte-editor-area" />
    </div>
  )
}
