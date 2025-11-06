import { useState, useCallback, useEffect } from 'react';

const useSearch = (items, searchKeys) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState(items);

  const search = useCallback((term) => {
    if (!term.trim()) {
      setSearchResults(items);
      return;
    }

    const results = items.filter(item =>
      searchKeys.some(key =>
        item[key].toString().toLowerCase().includes(term.toLowerCase())
      )
    );
    setSearchResults(results);
  }, [items, searchKeys]);

  useEffect(() => {
    search(searchTerm);
  }, [search, searchTerm, items]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    search
  };
};

export default useSearch;