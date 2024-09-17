import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'react-toastify';
import './BulkAction.css';
import {
  deselectAllProducts,
  selectAllProducts,
  selectorActiveTab,
  selectorProducts,
  selectorSelectedProducts,
  updateProductStatus,
} from '../../redux/slice/productsSlice';
import { useMemo } from 'react';
import { getProductsByStatus } from '../../utils/productByStatus';

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
      productsInActiveTab.length > 0 &&
      productsInActiveTab.every((product) =>
        selectedProducts.includes(product.id)
      ),
    [productsInActiveTab, selectedProducts]
  );

  const selectedProductsInTabCount = useMemo(
    () =>
      productsInActiveTab.filter((product) =>
        selectedProducts.includes(product.id)
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
    <div className='bulk-actions'>
      {productsInActiveTab.length > 0 ? (
        <div className='selected-count-wrapper'>
          <input
            type='checkbox'
            checked={isAllChecked}
            onChange={handleCheckAll}
          />
          <span className='selected-count'>
            {selectedProductsInTabCount} selected
          </span>
        </div>
      ) : (
        <h2 className='no-products-message'>
          There are no products in the {currentActiveTab} tab
        </h2>
      )}
      {selectedProducts.length > 0 && (
        <div>
          {(currentActiveTab === 'all' || currentActiveTab === 'excluded') && (
            <button
              onClick={() => handleBulkAction('included')}
              className='bulk-action-btn include'
            >
              Set Include Products
            </button>
          )}
          {(currentActiveTab === 'all' || currentActiveTab === 'included') && (
            <button
              onClick={() => handleBulkAction('excluded')}
              className='bulk-action-btn exclude'
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
