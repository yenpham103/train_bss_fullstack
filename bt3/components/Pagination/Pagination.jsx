import React from 'react';
import styles from './Pagination.module.css';

function Pagination({ currentPage, totalPages, onPageChange }) {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className={styles.pagination}>
      {pageNumbers.map((number) => (
        <button
          disabled={currentPage === number || totalPages === 1}
          key={number}
          onClick={() => onPageChange(number)}
          className={`${styles.pageButton} ${
            currentPage === number || totalPages === 1 ? styles.active : ''
          }`}
        >
          {number}
        </button>
      ))}
    </div>
  );
}

export default Pagination;
