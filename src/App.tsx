import { useEffect, useState, Suspense, lazy, useCallback } from 'react'
import { Navbar } from './components/layout/Navbar'
import { GetInvolvedSection } from './components/home/GetInvolvedSection'
import { FEATURES } from './constants/features'
import { HomeNewsSection } from './components/home/HomeNewsSection'
import { articles } from './constants/newsData'
import type { Article } from './constants/newsData'
import { ErrorBoundary } from './components/common/ErrorBoundary'
import { useAppStore } from './store/useAppStore'
import type { PageName } from './store/useAppStore'
import Lenis from 'lenis'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { gsap } from 'gsap'
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

gsap.registerPlugin(ScrollTrigger)

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
const AdminPortal = lazy(() => import('./components/admin/AdminPortal').then(m => ({ default: m.AdminPortal })))

const HASH_PAGE_MAP: Record<string, PageName> = {
  '#about': 'about',
  '#news': 'news',
  '#teams': 'teams',
  '#gallery': 'gallery',
  '#fixtures': 'fixtures',
  '#points-table': 'points-table',
  '#partnerships': 'partnerships',
  '#contact-us': 'contact',
  '#contact': 'contact',
  '#register-player': 'register-player',
  '#register': 'register-player',
  '#register-status': 'register-status',
  '#status': 'register-status',
  '#admin': 'admin-login',
  '#admin-login': 'admin-login',
  '#admin-dashboard': 'admin-dashboard',
}

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
  const [blogDetailArticle, setBlogDetailArticle] = useState<Article | null>(null)

  const handleScrollToTop = useCallback(() => {
    scrollToTop(true)
  }, [])

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
    })

    lenis.on('scroll', ScrollTrigger.update)

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000)
    }
    gsap.ticker.add(updateTicker)
    gsap.ticker.lagSmoothing(0)

    ;(window as unknown as { __lenis?: Lenis }).__lenis = lenis

    return () => {
      lenis.destroy()
      gsap.ticker.remove(updateTicker)
      delete (window as unknown as { __lenis?: Lenis }).__lenis
    }
  }, [])

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash

      if (HASH_PAGE_MAP[hash]) {
        setCurrentPage(HASH_PAGE_MAP[hash])
        handleScrollToTop()
        return
      }

      if (hash.startsWith('#blog/')) {
        const blogId = hash.replace('#blog/', '')
        const article = articles.find(a => a.id === blogId)
        if (article) {
          setBlogDetailArticle(article)
          setCurrentPage('blog-detail')
          handleScrollToTop()
        } else {
          setCurrentPage('home')
        }
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

            {FEATURES.SHOW_NEWS && (
              <>
                <div className="section-divider-line" />
                <HomeNewsSection />
              </>
            )}

            <CricketBallSeam currentPage={currentPage} />

            {FEATURES.SHOW_POINTS_TABLE && <PointsTableSection />}

            {FEATURES.SHOW_MOMENTS && (
              <>
                <div className="section-divider-line" />
                <Suspense fallback={<div className="skeleton-placeholder" style={{ minHeight: '300px', background: 'rgba(255,255,255,0.03)', borderRadius: '16px', margin: '2rem 0' }} />}>
                  <Moments />
                </Suspense>
              </>
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
            ) : currentPage === 'blog-detail' && blogDetailArticle ? (
              <BlogDetailPage article={blogDetailArticle} />
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
            ) : currentPage === 'league-faq' ? (
              <ComingSoonPage title="LEAGUE FAQ" />
            ) : currentPage === 'media-kit' ? (
              <ComingSoonPage title="MEDIA KIT" />
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
