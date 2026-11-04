/**
 * useNewsArticles
 * Fetches articles from the /prinfo backend and merges with static newsData.
 * Backend articles appear first (newest first), then static articles.
 * Module-level cache avoids re-fetching on page navigations.
 */
import { useState, useEffect } from 'react'
import { buildApiUrl, normalizeMediaUrl } from '../config/api'
import { articles as staticArticles } from '../constants/newsData'
import type { Article } from '../constants/newsData'

export interface PRArticle {
  id: number | string
  maintitle?: string
  title?: string
  description?: string
  author?: string
  category?: string
  prdate?: string
  imageurl?: string
  created_at?: string
}

export function stripHtml(html?: string): string {
  if (!html) return ''
  return html
    .replace(/<\/(p|div|h[1-6]|li|blockquote|tr)>/gi, ' ')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, ' ')
    .trim()
}

export function prToArticle(pr: PRArticle): Article {
  const dateStr = pr.prdate || pr.created_at || ''
  let formattedDate = ''
  if (dateStr) {
    const d = new Date(dateStr)
    if (!isNaN(d.getTime())) {
      formattedDate = d.toLocaleDateString('en-GB', {
        day: 'numeric', month: 'short', year: 'numeric'
      }).toUpperCase()
    } else {
      formattedDate = dateStr
    }
  }
  const cleanExcerpt = stripHtml(pr.description || '')
  return {
    id: `pr-${pr.id}`,
    category: (pr.category || 'General').toUpperCase(),
    title: pr.title || pr.maintitle || '(Untitled)',
    excerpt: cleanExcerpt.length > 200 ? cleanExcerpt.slice(0, 197) + '…' : cleanExcerpt,
    date: formattedDate,
    readTime: '2 MIN READ',
    img: normalizeMediaUrl(pr.imageurl) || pr.imageurl || '',
    featured: false,
    fullText: pr.description ? [pr.description] : [],
  } as Article
}

let _cache: Article[] | null = null
let _fetchPromise: Promise<Article[]> | null = null

async function fetchPRArticles(): Promise<Article[]> {
  try {
    const res = await fetch(buildApiUrl('/prinfo'))
    if (!res.ok) return []
    const json = await res.json()
    const list: PRArticle[] = Array.isArray(json)
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
    return list.map(prToArticle)
  } catch {
    return []
  }
}

function getOrFetch(): Promise<Article[]> {
  if (_cache) return Promise.resolve(_cache)
  if (!_fetchPromise) {
    _fetchPromise = fetchPRArticles().then(result => {
      _cache = result
      _fetchPromise = null
      return result
    })
  }
  return _fetchPromise
}

export function invalidateNewsCache() {
  _cache = null
  _fetchPromise = null
}

export interface UseNewsArticlesResult {
  allArticles: Article[]
  featuredArticles: Article[]
  isLoading: boolean
}

export function useNewsArticles(): UseNewsArticlesResult {
  const [prArticles, setPRArticles] = useState<Article[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    getOrFetch().then(result => {
      if (!cancelled) {
        setPRArticles(result)
        setIsLoading(false)
      }
    })
    return () => { cancelled = true }
  }, [])

  const allArticles = [...prArticles, ...staticArticles]
  const staticFeatured = staticArticles.filter(a => a.featured)
  const featuredArticles = staticFeatured.length > 0 ? staticFeatured : allArticles.slice(0, 1)

  return { allArticles, featuredArticles, isLoading }
}
