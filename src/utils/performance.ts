import { useEffect, useState, useCallback } from 'react';

// Performance monitoring
export const usePerformanceMonitor = () => {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'performance' in window) {
      const observer = new PerformanceObserver((list) => {
        list.getEntries().forEach((entry) => {
          // Report to analytics
          console.log('Performance Entry:', {
            name: entry.name,
            duration: entry.duration,
            type: entry.entryType,
          });
        });
      });

      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] });
      return () => observer.disconnect();
    }
  }, []);
};

// Image lazy loading with blur placeholder
export const useImageLoader = (src: string, placeholder: string) => {
  const [currentSrc, setCurrentSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.onload = () => {
      setCurrentSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return { currentSrc, isLoaded };
};

// Intersection observer for lazy loading
export const useIntersectionLoader = (options = {}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [element, setElement] = useState<HTMLElement | null>(null);

  const observer = useCallback(
    (node: HTMLElement | null) => {
      if (node) {
        const io = new IntersectionObserver(([entry]) => {
          setIsVisible(entry.isIntersecting);
        }, options);
        io.observe(node);
        setElement(node);
        return () => io.disconnect();
      }
    },
    [options]
  );

  return [observer, isVisible, element] as const;
}; 