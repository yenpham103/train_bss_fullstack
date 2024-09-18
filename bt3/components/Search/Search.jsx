import React, { useState } from 'react';
import styles from './Search.module.css';

function Search({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  return (
    <div className={styles.search}>
      <input
        type='text'
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder='Search products...'
        className={styles.searchInput}
      />
    </div>
  );
}

export default Search;
