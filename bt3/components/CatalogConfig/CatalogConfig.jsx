import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import {
  getProducts,
  selectCurrentPage,
  selectorActiveTab,
  selectorStatus,
  selectSearch,
  selectTotalPages,
  setActiveTab,
  setCurrentPage,
} from '@/slices/productsSlice';
import BulkActions from '../BulkActions/BulkActions';
import ProductList from '../ProductList/ProductList';
import Loading from '../Loading/Loading';
import styles from './CatalogConfig.module.css';
import Search from '../Search/Search';
import Pagination from '../Pagination/Pagination';

function CatalogConfig() {
  const currentPage = useSelector(selectCurrentPage);
  const search = useSelector(selectSearch);
  const activeTab = useSelector(selectorActiveTab);
  const dispatch = useDispatch();
  const status = useSelector(selectorStatus);

  useEffect(() => {
    dispatch(getProducts({ page: currentPage, status: activeTab }));
  }, [dispatch, currentPage, activeTab]);

  const handlePageChange = (page) => {
    dispatch(setCurrentPage(page));
  };
  const handleTabAction = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const handleSearch = (searchTerm) => {
    dispatch(searchProducts({ search: searchTerm, status: activeTab }));
  };

  const tabs = ['all', 'included', 'excluded'];

  if (status === 'rejected') return <h2> Something went wrong </h2>;

  return (
    <>
      {status === 'pending' ? (
        <Loading isLoading={status === 'pending'} />
      ) : (
        status === 'fulfilled' && (
          <div className={styles['catalog-config']}>
            <div className={styles.tabs}>
              {tabs.map((tab) => (
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
            <Search onSearch={handleSearch} />
            <BulkActions />
            <ProductList />
            <Pagination
              currentPage={currentPage}
              totalPages={3}
              onPageChange={handlePageChange}
            />
          </div>
        )
      )}
    </>
  );
}

export default CatalogConfig;
