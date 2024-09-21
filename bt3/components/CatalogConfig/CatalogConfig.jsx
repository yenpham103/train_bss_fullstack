import React, { useEffect, useRef, useCallback, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  selectorActiveTab,
  selectorCurrentPage,
  selectorError,
  selectorStatus,
  selectorTotalPages,
  setActiveTab,
  setCurrentPage,
} from '@/slices/productsSlice';
import BulkActions from '../BulkActions/BulkActions';
import ProductList from '../ProductList/ProductList';
import Loading from '../Loading/Loading';
import styles from './CatalogConfig.module.css';
import Pagination from '../Pagination/Pagination';
import { getProducts } from '@/slices/productsThunk';
import { useThrottle } from '@/hooks/useThrottle';
const TABS = ['all', 'included', 'excluded'];

function CatalogConfig() {
  const currentPage = useSelector(selectorCurrentPage);
  const activeTab = useSelector(selectorActiveTab);
  const dispatch = useDispatch();
  const totalPages = useSelector(selectorTotalPages);
  const status = useSelector(selectorStatus);
  const [retryDisabled, setRetryDisabled] = useState(true);
  const error = useSelector(selectorError);
  console.log(status);

  const throttledGetProducts = useThrottle(
    (page, tab) => dispatch(getProducts({ page, limit: 8, status: tab })),
    500
  );

  useEffect(() => {
    throttledGetProducts(currentPage, activeTab);
  }, [throttledGetProducts, currentPage, activeTab]);

  const handlePageChange = useCallback(
    (page) => {
      dispatch(setCurrentPage(page));
    },
    [dispatch]
  );

  const handleTabAction = useCallback(
    (tab) => {
      dispatch(setActiveTab(tab));
      dispatch(setCurrentPage(1));
    },
    [dispatch]
  );

  // setTimeout(() => {
  //   setRetryDisabled(true);
  // }, 1000);

  // useEffect(() => {
  //   if (status === 'rejected') {
  //     const timer = setTimeout(() => {
  //       setRetryDisabled(false);
  //     }, 1000);
  //     return () => clearTimeout(timer);
  //   }
  // }, [status]);

  const handleRetry = useCallback(() => {
    throttledGetProducts(currentPage, activeTab);
  }, [throttledGetProducts, currentPage, activeTab]);

  if (status === 'rejected') {
    return (
      <div className={styles.errorContainer}>
        <h2 className={styles.error}>{error}</h2>
        <button
          onClick={handleRetry}
          className={styles.retryButton}
          disabled={retryDisabled}
        >
          Thử lại
        </button>
      </div>
    );
  }
  return (
    <>
      {status === 'pending' ? (
        <Loading isLoading={true} />
      ) : (
        status === 'fulfilled' && (
          <div className={styles['catalog-config']}>
            <div className={styles.TABS}>
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabAction(tab)}
                  className={clsx(
                    styles.tab,
                    activeTab === tab && styles.active
                  )}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
            <BulkActions />
            <ProductList />
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )
      )}
    </>
  );
}

export default CatalogConfig;
