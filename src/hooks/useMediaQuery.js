import { useState, useCallback, useLayoutEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(false);

  const handleChange = useCallback((e) => {
    setMatches(e.matches);
  }, []);

  useLayoutEffect(() => {
    const mediaQuery = window.matchMedia(query);
    setMatches(mediaQuery.matches);

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, [query, handleChange]);

  return matches;
};

export default useMediaQuery;