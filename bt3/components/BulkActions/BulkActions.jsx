import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import styles from './BulkAction.module.css';
import {
  deselectAllProducts,
  selectAllProducts,
  selectorActiveTab,
  selectorProducts,
  selectorSelectedProducts,
  // updateProductStatus,
} from '@/slices/productsSlice';
import { getProductsByStatus } from '@/utils/productByStatus';
import { updateProductStatus } from '@/slices/productsThunk';

function BulkActions() {
  const selectedProducts = useSelector(selectorSelectedProducts);
  const allProducts = useSelector(selectorProducts);
  const currentActiveTab = useSelector(selectorActiveTab);
  const dispatch = useDispatch();

  const productsInActiveTab = useMemo(
    () => getProductsByStatus(allProducts, currentActiveTab),
    [allProducts, currentActiveTab]
  );

  const isAllChecked = useMemo(
    () =>
      productsInActiveTab?.length > 0 &&
      productsInActiveTab?.every((product) =>
        selectedProducts?.includes(product.id)
      ),
    [productsInActiveTab, selectedProducts]
  );

  const selectedProductsInTabCount = useMemo(
    () =>
      productsInActiveTab?.filter((product) =>
        selectedProducts?.includes(product.id)
      ).length,
    [productsInActiveTab, selectedProducts]
  );

  const handleCheckAll = () => {
    if (isAllChecked) {
      dispatch(deselectAllProducts());
    } else {
      dispatch(selectAllProducts());
    }
  };

  const handleBulkAction = (status) => {
    const selectedProductsInTab = productsInActiveTab
      .filter((product) => selectedProducts.includes(product.id))
      .map((product) => product.id);

    if (selectedProductsInTab.length > 0) {
      dispatch(updateProductStatus({ ids: selectedProductsInTab, status }));
    } else {
      toast.error('No products selected in this tab!');
    }
  };

  return (
    <div className={styles['bulk-actions']}>
      {productsInActiveTab?.length > 0 ? (
        <div className={styles['bulk-actions-header']}>
          <div className={styles['selected-count-wrapper']}>
            <input
              type='checkbox'
              checked={isAllChecked}
              onChange={handleCheckAll}
            />
            <span className={styles['selected-count']}>
              {selectedProductsInTabCount} selected
            </span>
          </div>
        </div>
      ) : (
        <h2 className={styles['no-products-message']}>
          There are no products in the {currentActiveTab} tab
        </h2>
      )}

      {selectedProducts.length > 0 && (
        <div>
          {(currentActiveTab === 'all' || currentActiveTab === 'excluded') &&
            productsInActiveTab.length > 0 && (
              <button
                onClick={() => handleBulkAction('included')}
                className={`${styles['bulk-action-btn']} ${styles.include}`}
              >
                Set Include Products
              </button>
            )}
          {(currentActiveTab === 'all' || currentActiveTab === 'included') &&
            productsInActiveTab.length > 0 && (
              <button
                onClick={() => handleBulkAction('excluded')}
                className={`${styles['bulk-action-btn']} ${styles.exclude}`}
              >
                Set Exclude Products
              </button>
            )}
        </div>
      )}
    </div>
  );
}

export default BulkActions;
