import React, { useState, useRef, useEffect } from 'react'
import './OptimizedImage.css'

export interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  aspectRatio?: string | number
  objectFit?: 'cover' | 'contain' | 'fill' | 'none' | 'scale-down'
  priority?: boolean
  wrapperClassName?: string
  wrapperStyle?: React.CSSProperties
  fallback?: React.ReactNode
}

export function OptimizedImage({
  src,
  alt,
  aspectRatio,
  objectFit = 'cover',
  priority = false,
  className = '',
  wrapperClassName = '',
  style,
  wrapperStyle,
  fallback,
  onLoad,
  onError,
  ...rest
}: OptimizedImageProps) {
  const [isLoaded, setIsLoaded] = useState(false)
  const [hasError, setHasError] = useState(false)
  const imgRef = useRef<HTMLImageElement>(null)

  // If image was already cached by browser, mark loaded immediately to prevent flash
  useEffect(() => {
    setIsLoaded(false)
    setHasError(false)

    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true)
    }
  }, [src])

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true)
    onLoad?.(e)
  }

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setHasError(true)
    setIsLoaded(true)
    onError?.(e)
  }

  return (
    <div
      className={`apl-opt-img-wrap ${wrapperClassName}`}
      style={{
        aspectRatio: aspectRatio ? String(aspectRatio) : undefined,
        ...wrapperStyle,
      }}
    >
      {/* Shimmer skeleton until loaded */}
      <div className={`apl-opt-img-skeleton ${isLoaded ? 'apl-hidden' : ''}`} />

      {hasError ? (
        fallback ? (
          <div className="apl-opt-img-fallback">{fallback}</div>
        ) : (
          <div className="apl-opt-img-fallback">Unable to load</div>
        )
      ) : (
        <img
          ref={imgRef}
          src={src}
          alt={alt}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
          fetchPriority={priority ? 'high' : 'auto'}
          className={`apl-opt-img ${isLoaded ? 'apl-loaded' : ''} ${className}`}
          style={{
            objectFit,
            ...style,
          }}
          onLoad={handleLoad}
          onError={handleError}
          {...rest}
        />
      )}
    </div>
  )
}
