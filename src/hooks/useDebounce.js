import { useEffect, useCallback } from 'react';

const useDebounce = (callback, delay, dependencies = []) => {
  const debouncedCallback = useCallback(callback, dependencies);

  useEffect(() => {
    const timer = setTimeout(() => {
      debouncedCallback();
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [debouncedCallback, delay]);
};

export default useDebounce;