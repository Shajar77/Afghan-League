import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

interface CricketBallSeamProps {
  currentPage: string
}

export function CricketBallSeam({ currentPage }: CricketBallSeamProps) {
  const ballRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!ballRef.current) return
    const ball = ballRef.current
    const sphere = ball.querySelector('.seam-ball-sphere')
    const tl = gsap.timeline({ repeat: -1 })
    let trackWidth = window.innerWidth + 80

    tl.set(ball, { x: -60, y: 0, scaleY: 1, scaleX: 1 })
    tl.set(sphere, { rotation: 0 })
    tl.to(ball, { x: trackWidth, duration: 3.8, ease: 'none' }, 0)
    tl.to(sphere, { rotation: 1440, duration: 3.8, ease: 'none' }, 0)
    tl.to(ball, { y: -34, scaleY: 1.06, scaleX: 0.94, duration: 0.4, ease: 'power1.out' }, 0)
      .to(ball, { y: 0, scaleY: 1.0, scaleX: 1.0, duration: 0.4, ease: 'power1.in' }, 0.4)
      .to(ball, { y: 0, scaleY: 0.76, scaleX: 1.24, duration: 0.08, ease: 'power1.out' }, 0.8)
      .to(ball, { y: -12, scaleY: 1.03, scaleX: 0.97, duration: 0.24, ease: 'power1.out' }, 0.88)
      .to(ball, { y: 0, scaleY: 1.0, scaleX: 1.0, duration: 0.24, ease: 'power1.in' }, 1.12)
      .to(ball, { y: 0, scaleY: 0.86, scaleX: 1.14, duration: 0.08, ease: 'power1.out' }, 1.36)
      .to(ball, { y: 0, scaleY: 1.0, scaleX: 1.0, duration: 0.08, ease: 'power1.out' }, 1.44)

    let lastWidth = window.innerWidth
    const handleResize = () => {
      const currentWidth = window.innerWidth
      if (currentWidth === lastWidth) return
      lastWidth = currentWidth
      trackWidth = currentWidth + 80
      const xTween = tl.getChildren(false, true, false).find(t => t.vars && t.vars.x !== undefined)
      if (xTween) xTween.vars.x = trackWidth
      tl.invalidate().restart()
    }

    window.addEventListener('resize', handleResize)
    return () => {
      tl.kill()
      window.removeEventListener('resize', handleResize)
    }
  }, [currentPage])

  return (
    <div className="cricket-seam-separator">
      <div className="cricket-seam-track">
        <div className="cricket-seam-stitch top-stitch"></div>
        <div className="cricket-seam-center-white-line"></div>
        <div className="cricket-seam-stitch bottom-stitch"></div>
      </div>
      <div ref={ballRef} className="seam-ball-container">
        <div className="seam-ball-sphere">
          <div className="seam-ball-inner-line left-line"></div>
          <div className="seam-ball-inner-split"></div>
          <div className="seam-ball-inner-line right-line"></div>
          <div className="seam-ball-gloss"></div>
          <div className="seam-ball-scuffs"></div>
        </div>
      </div>
    </div>
  )
}
