import React, { useEffect, useState, useCallback } from 'react';
import styles from './Search.module.css';
import { useDispatch, useSelector } from 'react-redux';
import { selectorActiveTab } from '@/slices/productsSlice';
import useDebounce from '@/hooks/useDebounce';
import { getProducts, searchProducts } from '@/slices/productsThunk';

function Search() {
  const [searchTerm, setSearchTerm] = useState('');
  const activeTab = useSelector(selectorActiveTab);
  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const dispatch = useDispatch();

  const performSearch = useCallback(
    (term, tabStatus) => {
      if (term.trim() !== '') {
        dispatch(searchProducts({ search: term, status: tabStatus }));
      } else {
        dispatch(getProducts({ status: tabStatus }));
      }
    },
    [dispatch]
  );

  useEffect(() => {
    performSearch(debouncedSearchTerm, activeTab);
  }, [debouncedSearchTerm, activeTab, performSearch]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      performSearch(searchTerm, activeTab);
    }
  };

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
  };

  return (
    <div className={styles.searchContainer}>
      <h1 className={styles.title}>CATALOG CONFIG APP</h1>
      <form className={styles.search}>
        <input
          type='text'
          value={searchTerm}
          onChange={handleInputChange}
          placeholder='Search products...'
          className={styles.searchInput}
          onKeyDown={handleKeyDown}
        />
      </form>
    </div>
  );
}

export default Search;
