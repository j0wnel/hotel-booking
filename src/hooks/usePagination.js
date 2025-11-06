import { useState, useEffect, useCallback } from 'react';

const usePagination = (data, itemsPerPage = 10) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [paginatedData, setPaginatedData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.length / itemsPerPage));
      const startIndex = (currentPage - 1) * itemsPerPage;
      const endIndex = startIndex + itemsPerPage;
      setPaginatedData(data.slice(startIndex, endIndex));
    }
  }, [data, currentPage, itemsPerPage]);

  const nextPage = useCallback(() => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  }, [totalPages]);

  const prevPage = useCallback(() => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  }, []);

  const goToPage = useCallback((page) => {
    const pageNumber = Math.max(1, Math.min(page, totalPages));
    setCurrentPage(pageNumber);
  }, [totalPages]);

  return {
    currentPage,
    paginatedData,
    totalPages,
    nextPage,
    prevPage,
    goToPage,
  };
};

export default usePagination;