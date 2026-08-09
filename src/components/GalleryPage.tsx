import { useState } from 'react'
import Masonry from './Masonry'
import { AnimatedCounter } from './AnimatedCounter'
import { X } from 'lucide-react'
import gallery1 from '../assets/gallery-1.webp'
import gallery2 from '../assets/gallery-2.webp'
import gallery3 from '../assets/gallery-3.webp'
import gallery4 from '../assets/gallery-4.webp'
import gallery5 from '../assets/gallery-5.webp'
import gallery6 from '../assets/gallery-6.webp'
import gallery7 from '../assets/gallery-7.webp'
import gallery8 from '../assets/gallery-8.webp'
import imgFans from '../assets/SunRisers-Leeds-fans-at-Headingley.webp'
import imgAction1 from '../assets/GettyImages-2230120408.webp'
import imgAction2 from '../assets/AD1_0256-2130422.webp'
import imgAction3 from '../assets/GettyImages-1335413950.webp'
import imgAction4 from '../assets/GettyImages-2163231267.webp'
import imgStad from '../assets/2166774277.webp'
import imgPress from '../assets/AD1_2727_zQkE8coH_20230809060237-1610761.webp'
import newGallery1 from '../assets/new-gallery-1.jpg'
import newGallery2 from '../assets/new-gallery-2.jpg'
import newGallery3 from '../assets/new-gallery-3.jpg'
import newGallery4 from '../assets/new-gallery-4.jpg'
import newGallery5 from '../assets/new-gallery-5.jpg'
import newGallery6 from '../assets/new-gallery-6.jpg'
import newGallery7 from '../assets/new-gallery-7.jpg'
import './GalleryPage.css'

interface GalleryItem {
  id: string
  img: string
  url: string
  height: number
  category: string
}

const allGalleryItems: GalleryItem[] = [
  { id: 'gp1', img: imgAction1, url: '#', height: 600, category: 'MATCH ACTION' },
  { id: 'gp2', img: gallery2, url: '#', height: 400, category: 'FANS & STADIUM' },
  { id: 'gp3', img: gallery3, url: '#', height: 500, category: 'BEHIND THE SCENES' },
  { id: 'gp4', img: imgAction2, url: '#', height: 750, category: 'MATCH ACTION' },
  { id: 'gp5', img: gallery5, url: '#', height: 550, category: 'BEHIND THE SCENES' },
  { id: 'gp6', img: imgFans, url: '#', height: 450, category: 'FANS & STADIUM' },
  { id: 'gp7', img: gallery7, url: '#', height: 650, category: 'PRESS & LAUNCH' },
  { id: 'gp8', img: gallery8, url: '#', height: 700, category: 'BEHIND THE SCENES' },
  { id: 'gp9', img: imgAction3, url: '#', height: 500, category: 'MATCH ACTION' },
  { id: 'gp10', img: imgStad, url: '#', height: 600, category: 'FANS & STADIUM' },
  { id: 'gp11', img: imgPress, url: '#', height: 400, category: 'PRESS & LAUNCH' },
  { id: 'gp12', img: imgAction4, url: '#', height: 700, category: 'MATCH ACTION' },
  { id: 'gp13', img: gallery1, url: '#', height: 500, category: 'MATCH ACTION' },
  { id: 'gp14', img: gallery4, url: '#', height: 650, category: 'BEHIND THE SCENES' },
  { id: 'gp15', img: gallery6, url: '#', height: 450, category: 'PRESS & LAUNCH' },
  { id: 'gp16', img: newGallery1, url: '#', height: 500, category: 'MATCH ACTION' },
  { id: 'gp17', img: newGallery2, url: '#', height: 700, category: 'FANS & STADIUM' },
  { id: 'gp18', img: newGallery3, url: '#', height: 450, category: 'BEHIND THE SCENES' },
  { id: 'gp19', img: newGallery4, url: '#', height: 600, category: 'MATCH ACTION' },
  { id: 'gp20', img: newGallery5, url: '#', height: 550, category: 'FANS & STADIUM' },
  { id: 'gp21', img: newGallery6, url: '#', height: 800, category: 'BEHIND THE SCENES' },
  { id: 'gp22', img: newGallery7, url: '#', height: 500, category: 'PRESS & LAUNCH' },
]

const categories = ['ALL IMAGES', 'MATCH ACTION', 'FANS & STADIUM', 'BEHIND THE SCENES', 'PRESS & LAUNCH']

export function GalleryPage() {
  const [selectedCategory, setSelectedCategory] = useState('ALL IMAGES')
  const [activeLightboxImg, setActiveLightboxImg] = useState<string | null>(null)

  const filteredItems = allGalleryItems.filter(item => {
    if (selectedCategory === 'ALL IMAGES') return true
    return item.category === selectedCategory
  })

  return (
    <div className="gallery-page-container">

      {/* HERO SECTION */}
      <section className="gallery-hero">
        <div className="gallery-hero-grid-bg" />
        <div className="gallery-hero-glow-left" />
        <div className="gallery-hero-glow-right" />

        <div className="gallery-hero-inner">
          <div className="gallery-hero-left">
            <div className="gallery-live-badge">
              <span className="gallery-live-dot" />
              <span className="gallery-live-text">OFFICIAL GALLERY</span>
            </div>

            <div className="gallery-hero-heading-wrap">
              <h1 className="gallery-hero-title">GALLERY<span className="dot-accent">.</span></h1>
              <div className="gallery-hero-underline" />
            </div>

            <p className="gallery-hero-subtitle">
              Relive the action, passion, and historic milestones of the Afghanistan Premier League. 
              Browse through match captures, stadiums, fan celebrations, and exclusive events.
            </p>
          </div>

          <div className="gallery-hero-stats">
            <div className="gallery-stat-item">
              <span className="gallery-stat-number">
                <AnimatedCounter target={840} suffix="+" />
              </span>
              <span className="gallery-stat-label">PHOTOS</span>
            </div>
            <div className="gallery-stat-divider" />
            <div className="gallery-stat-item">
              <span className="gallery-stat-number">
                <AnimatedCounter target={1.2} suffix="M+" duration={1500} />
              </span>
              <span className="gallery-stat-label">VIEWS</span>
            </div>
            <div className="gallery-stat-divider" />
            <div className="gallery-stat-item">
              <span className="gallery-stat-number">
                <AnimatedCounter target={18} />
              </span>
              <span className="gallery-stat-label">MATCHES</span>
            </div>
          </div>
        </div>

        {/* CATEGORY FILTER SWITCHER ROW */}
        <div className="gallery-filter-bar-wrap">
          <div className="gallery-filter-bar">
            {categories.map(cat => (
              <button
                key={cat}
                className={`gallery-filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="gallery-hero-bottom-bar" />
      </section>

      {/* MASONRY IMAGE GRID SECTION */}
      <section className="gallery-grid-wrapper">
        <div className="gallery-grid-inner">
          <Masonry
            items={filteredItems}
            ease="power3.out"
            duration={0.6}
            stagger={0.03}
            animateFrom="bottom"
            scaleOnHover={true}
            hoverScale={0.96}
            blurToFocus={true}
            colorShiftOnHover={false}
            onItemClick={(item) => setActiveLightboxImg(item.img)}
          />
        </div>
      </section>

      {activeLightboxImg && (
        <div 
          className="gallery-lightbox-overlay animate-fade-in" 
          onClick={() => setActiveLightboxImg(null)}
        >
          <button 
            className="gallery-lightbox-close" 
            onClick={() => setActiveLightboxImg(null)}
            aria-label="Close Lightbox"
          >
            <X size={28} />
          </button>
          <div className="gallery-lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={activeLightboxImg} alt="APL Gallery Large" className="gallery-lightbox-img" />
          </div>
        </div>
      )}

    </div>
  )
}
