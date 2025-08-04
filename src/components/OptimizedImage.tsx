import { useState, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface OptimizedImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  fallback?: string;
  lazy?: boolean;
  blurDataURL?: string;
  className?: string;
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/placeholder.svg',
  lazy = true,
  blurDataURL,
  className,
  ...props
}: OptimizedImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isInView, setIsInView] = useState(!lazy);
  const imgRef = useRef<HTMLImageElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    if (!lazy || !imgRef.current) return;

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observerRef.current?.disconnect();
        }
      },
      { threshold: 0.1, rootMargin: '50px' }
    );

    observerRef.current.observe(imgRef.current);

    return () => observerRef.current?.disconnect();
  }, [lazy]);

  const handleLoad = () => {
    setIsLoading(false);
    setHasError(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setHasError(true);
  };

  const shouldShowImage = isInView && !hasError;
  const imageSrc = shouldShowImage ? src : (hasError ? fallback : undefined);

  return (
    <div ref={imgRef} className={cn('relative overflow-hidden', className)}>
      {/* Blur placeholder */}
      {isLoading && blurDataURL && (
        <img
          src={blurDataURL}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-sm scale-110"
          aria-hidden="true"
        />
      )}
      
      {/* Loading skeleton */}
      {isLoading && !blurDataURL && (
        <div className="absolute inset-0 bg-muted animate-pulse" />
      )}

      {/* Main image */}
      {shouldShowImage && (
        <img
          src={imageSrc}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          className={cn(
            'w-full h-full object-cover transition-opacity duration-300',
            isLoading ? 'opacity-0' : 'opacity-100'
          )}
          loading={lazy ? 'lazy' : 'eager'}
          {...props}
        />
      )}

      {/* Error state */}
      {hasError && (
        <div className="absolute inset-0 bg-muted flex items-center justify-center">
          <div className="text-muted-foreground text-sm text-center p-4">
            <div className="mb-2">⚠️</div>
            <div>Failed to load image</div>
          </div>
        </div>
      )}
    </div>
  );
}