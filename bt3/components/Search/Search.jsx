import React, { useEffect, useState } from 'react';
import styles from './Search.module.css';
import { useDispatch, useSelector } from 'react-redux';
import {
  searchProducts,
  selectorActiveTab,
  selectorCurrentPage,
} from '@/slices/productsSlice';
import useDebounce from '@/hooks/useDebounce';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const currentPage = useSelector(selectorCurrentPage);
  const activeTab = useSelector(selectorActiveTab);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const dispatch = useDispatch();
  const performSearch = (term) => {
    dispatch(searchProducts({ search: term, status: activeTab, page: 1 }));
  };
  useEffect(() => {
    if (debouncedSearchTerm) {
      performSearch(debouncedSearchTerm);
    }
  }, [debouncedSearchTerm]);
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(localSearchTerm);
    }
  };
  // const handleSearch = () => {
  //   dispatch(
  //     searchProducts({
  //       search: searchTerm,
  //       page: currentPage,
  //       status: activeTab,
  //     })
  //   );
  // };

  return (
    <form className={styles.search}>
      <input
        type='text'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        // onBlur={handleSearch}
        placeholder='Search products...'
        className={styles.searchInput}
        onKeyDown={handleKeyDown}
      />
    </form>
  );
}

export default Search;
