import { useRef, useEffect, useCallback } from 'react';

const useIntersectionObserver = (options = {}) => {
  const targetRef = useRef(null);
  const observerRef = useRef(null);

  const callback = useCallback((entries) => {
    const entry = entries[0];
    if (options.onIntersect && entry.isIntersecting) {
      options.onIntersect(entry);
    }
  }, [options]);

  useEffect(() => {
    const target = targetRef.current;
    observerRef.current = new IntersectionObserver(callback, {
      root: options.root || null,
      rootMargin: options.rootMargin || '0px',
      threshold: options.threshold || 0,
    });

    if (target) {
      observerRef.current.observe(target);
    }

    return () => {
      if (observerRef.current && target) {
        observerRef.current.unobserve(target);
      }
    };
  }, [callback, options.root, options.rootMargin, options.threshold]);

  return targetRef;
};

export default useIntersectionObserver;