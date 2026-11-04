import { useEffect, useState, Suspense, lazy, useCallback } from 'react'
import { Navbar } from './components/layout/Navbar'
import { GetInvolvedSection } from './components/home/GetInvolvedSection'
import { FEATURES } from './constants/features'
import { HomeNewsSection } from './components/home/HomeNewsSection'
import { articles } from './constants/newsData'
import type { Article } from './constants/newsData'
import { prToArticle } from './hooks/useNewsArticles'
import { buildApiUrl } from './config/api'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { useAppStore, HASH_PAGE_MAP } from './store/useAppStore'
import Lenis from 'lenis'
import { scrollToTop } from './utils/lenis'

import { HeroSection } from './components/home/HeroSection'
import { StatsBarSection } from './components/home/StatsBarSection'
import { TeamsGridSection } from './components/home/TeamsGridSection'
import { PointsTableSection } from './components/home/PointsTableSection'
import { GrandLaunchSection } from './components/home/GrandLaunchSection'
import { VisionSection } from './components/home/VisionSection'
import { MoreAboutSection } from './components/home/MoreAboutSection'
import { OfficialPartnersSection } from './components/home/OfficialPartnersSection'
import { CricketBallSeam } from './components/home/CricketBallSeam'
import { Footer } from './components/layout/Footer'

import './App.css'

const About = lazy(() => import('./components/pages/About').then(m => ({ default: m.About })))
const Moments = lazy(() => import('./components/pages/Moments').then(m => ({ default: m.Moments })))
const News = lazy(() => import('./components/pages/News').then(m => ({ default: m.News })))
const BlogDetailPage = lazy(() => import('./components/pages/BlogDetailPage').then(m => ({ default: m.BlogDetailPage })))
const GalleryPage = lazy(() => import('./components/pages/GalleryPage').then(m => ({ default: m.GalleryPage })))
const FixturesPage = lazy(() => import('./components/pages/FixturesPage').then(m => ({ default: m.FixturesPage })))
const PointsTable = lazy(() => import('./components/pages/PointsTable').then(m => ({ default: m.PointsTable })))
const PartnershipsPage = lazy(() => import('./components/pages/PartnershipsPage').then(m => ({ default: m.PartnershipsPage })))
const ContactPage = lazy(() => import('./components/pages/ContactPage').then(m => ({ default: m.ContactPage })))
const TeamsPage = lazy(() => import('./components/pages/TeamsPage').then(m => ({ default: m.TeamsPage })))
const ComingSoonPage = lazy(() => import('./components/pages/ComingSoonPage').then(m => ({ default: m.ComingSoonPage })))
const RegisterPage = lazy(() => import('./components/pages/RegisterPage').then(m => ({ default: m.RegisterPage })))
const RegisterStatusPage = lazy(() => import('./components/pages/RegisterStatusPage').then(m => ({ default: m.RegisterStatusPage })))
const PlayerVideoPage = lazy(() => import('./components/pages/PlayerVideoPage').then(m => ({ default: m.PlayerVideoPage })))
const AdminPortal = lazy(() => import('./components/admin/AdminPortal').then(m => ({ default: m.AdminPortal })))
const PrivacyPolicyPage = lazy(() => import('./components/pages/PrivacyPolicyPage').then(m => ({ default: m.PrivacyPolicyPage })))

function PageLoadingSpinner() {
  return (
    <div style={{
      minHeight: '60vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      fontFamily: 'var(--font-display)',
      color: 'var(--brand-gold)'
    }}>
      <div className="page-loading-spinner" style={{
        width: '40px',
        height: '40px',
        border: '3px solid rgba(255, 255, 255, 0.1)',
        borderTopColor: 'var(--brand-gold)',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }}></div>
      <span style={{ fontSize: '1.5rem', letterSpacing: '0.1em' }}>LOADING...</span>
    </div>
  )
}

function App() {
  const { currentPage, setCurrentPage } = useAppStore()
  const [blogDetailArticle, setBlogDetailArticle] = useState<Article | null>(() => {
    if (typeof window === 'undefined') return null
    const rawHash = window.location.hash
    const hash = rawHash ? rawHash.split('?')[0].split('&')[0] : ''
    if (hash.startsWith('#blog/')) {
      const blogId = hash.replace('#blog/', '')
      return articles.find(a => a.id === blogId) || null
    }
    return null
  })

  const handleScrollToTop = useCallback(() => {
    scrollToTop(true)
  }, [])

  // Initialize Lenis smooth scroll with lightweight requestAnimationFrame
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

      ; (window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const rawHash = window.location.hash
      const hash = rawHash ? rawHash.split('?')[0].split('&')[0] : ''

      if (HASH_PAGE_MAP[hash]) {
        setCurrentPage(HASH_PAGE_MAP[hash])
        handleScrollToTop()
        return
      }

      if (hash.startsWith('#blog/')) {
        const blogId = hash.replace('#blog/', '')
        // 1. Try static articles first
        const staticArticle = articles.find(a => a.id === blogId)
        if (staticArticle) {
          setBlogDetailArticle(staticArticle)
          setCurrentPage('blog-detail')
          handleScrollToTop()
          return
        }
        // 2. Try backend PR article (id format: pr-123)
        if (blogId.startsWith('pr-')) {
          const prId = blogId.replace('pr-', '')
          setCurrentPage('blog-detail')
          setBlogDetailArticle(null)
          handleScrollToTop()

          fetch(buildApiUrl(`/prinfo/${prId}`))
            .then(r => r.ok ? r.json() : null)
            .then(json => {
              if (json) {
                const pr = json.data || json
                setBlogDetailArticle(prToArticle(pr))
                handleScrollToTop()
              } else {
                setCurrentPage('news')
              }
            })
            .catch(() => setCurrentPage('news'))
          return
        }
        setCurrentPage('home')
        return
      }

      if (hash && hash !== '#home' && hash !== '') {
        window.history.replaceState(null, '', '#home')
      }
      setCurrentPage('home')
      handleScrollToTop()
    }

    handleHashChange()
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [setCurrentPage, handleScrollToTop])

  // Admin portal is fully self-contained — no Navbar/Footer
  if (currentPage === 'admin-login' || currentPage === 'admin-dashboard') {
    return (
      <ErrorBoundary>
        <Suspense fallback={<PageLoadingSpinner />}>
          <AdminPortal />
        </Suspense>
      </ErrorBoundary>
    )
  }

  return (
    <div className="app-container">
      <Navbar />

      {currentPage === 'home' ? (
        <>
          <HeroSection />
          <StatsBarSection />

          <main className="app-main">
            {FEATURES.SHOW_TEAMS && <TeamsGridSection />}

            {FEATURES.SHOW_NEWS && <HomeNewsSection />}

            {FEATURES.SHOW_POINTS_TABLE && <PointsTableSection />}

            <CricketBallSeam currentPage={currentPage} />

            {FEATURES.SHOW_MOMENTS && (
              <Suspense fallback={<div className="skeleton-placeholder" style={{ minHeight: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', margin: '2rem 0' }} />}>
                <Moments />
              </Suspense>
            )}

            {FEATURES.SHOW_LAUNCH_EVENT && <GrandLaunchSection />}

            <VisionSection />

            <div className="section-divider-line" />

            {FEATURES.SHOW_MORE_ABOUT_APL && (
              <>
                <CricketBallSeam currentPage={currentPage} />
                <MoreAboutSection />
                <div className="section-divider-line" />
              </>
            )}

            <GetInvolvedSection />

            <div className="section-divider-line" />

            <OfficialPartnersSection />
          </main>
        </>
      ) : (
        <ErrorBoundary>
          <Suspense fallback={<PageLoadingSpinner />}>
            {currentPage === 'news' ? (
              <News />
            ) : currentPage === 'blog-detail' ? (
              blogDetailArticle ? (
                <BlogDetailPage article={blogDetailArticle} />
              ) : (
                <PageLoadingSpinner />
              )
            ) : currentPage === 'teams' ? (
              <TeamsPage />
            ) : currentPage === 'gallery' ? (
              <GalleryPage />
            ) : currentPage === 'fixtures' ? (
              <FixturesPage />
            ) : currentPage === 'points-table' ? (
              <PointsTable />
            ) : currentPage === 'partnerships' ? (
              <PartnershipsPage />
            ) : currentPage === 'contact' ? (
              <ContactPage />
            ) : currentPage === 'acb-governance' ? (
              <ComingSoonPage title="ACB GOVERNANCE" />
            ) : (currentPage === 'register-player' || currentPage === 'player-register') ? (
              <RegisterPage />
            ) : currentPage === 'register-status' ? (
              <RegisterStatusPage />
            ) : currentPage === 'player-video' ? (
              <PlayerVideoPage />
            ) : currentPage === 'league-faq' ? (
              <ComingSoonPage title="LEAGUE FAQ" />
            ) : currentPage === 'media-kit' ? (
              <ComingSoonPage title="MEDIA KIT" />
            ) : currentPage === 'privacy-policy' ? (
              <PrivacyPolicyPage />
            ) : (
              <About />
            )}
          </Suspense>
        </ErrorBoundary>
      )}

      <Footer />
    </div>
  )
}

export default App
