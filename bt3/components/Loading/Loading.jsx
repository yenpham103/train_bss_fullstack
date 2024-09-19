import React from 'react';
import { ClipLoader } from 'react-spinners';
import styles from './Loading.module.css';

export default function Loading({ isLoading, size = 100, color = '#3498db' }) {
  return (
    <div className={styles['loading-container']}>
      {isLoading && (
        <ClipLoader
          className={styles['clip-loader']}
          size={size}
          color={color}
        />
      )}
    </div>
  );
}
