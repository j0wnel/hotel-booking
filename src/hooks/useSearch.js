import { useState, useMemo } from 'react';
import useDebounce from './useDebounce';

const useSearch = (items = [], searchKeys = []) => {
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const searchResults = useMemo(() => {
    const term = debouncedSearchTerm.trim().toLowerCase();
    if (!term) return items;

    return items.filter(item =>
      searchKeys.some(key => {
        const value = item[key];
        return value != null && 
               value.toString().toLowerCase().includes(term);
      })
    );
  }, [items, searchKeys, debouncedSearchTerm]);

  return {
    searchTerm,
    setSearchTerm,
    searchResults
  };
};

export default useSearch;