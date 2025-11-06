import { useCallback, useState, useEffect } from 'react';

const useFilters = (initialFilters) => {
  const [filters, setFilters] = useState(initialFilters);
  const [appliedFilters, setAppliedFilters] = useState(initialFilters);

  const updateFilter = useCallback((key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
  }, [initialFilters]);

  const applyFilters = useCallback(() => {
    setAppliedFilters(filters);
  }, [filters]);

  useEffect(() => {
    // Optional: Automatically apply filters after a delay
    const timer = setTimeout(() => {
      applyFilters();
    }, 500);

    return () => clearTimeout(timer);
  }, [filters, applyFilters]);

  return {
    filters,
    appliedFilters,
    updateFilter,
    resetFilters,
    applyFilters
  };
};

export default useFilters;