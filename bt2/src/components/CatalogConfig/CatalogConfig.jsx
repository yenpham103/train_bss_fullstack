import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  getProducts,
  selectorActiveTab,
  selectorStatus,
  setActiveTab,
} from '../../redux/slice/productsSlice';
import clsx from 'clsx';
import Loading from '../Loading';
import ProductList from '../ProductList/ProductList';
import BulkActions from '../BulkActions/BulkActions';
import './CatalogConfig.css';

function CatalogConfig() {
  const activeTab = useSelector(selectorActiveTab);
  // console.log(activeTab);

  const dispatch = useDispatch();
  const status = useSelector(selectorStatus);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleTabAction = (tab) => {
    dispatch(setActiveTab(tab));
  };

  const tabs = ['all', 'included', 'excluded'];

  if (status === 'rejected') return <h2> Something went wrong </h2>;

  return (
    <>
      {status === 'pending' ? (
        <Loading isLoading={status === 'pending'} />
      ) : (
        status === 'fulfilled' && (
          <div className='catalog-config'>
            <div className='tabs'>
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => handleTabAction(tab)}
                  className={clsx('tab', activeTab === tab && 'active')}
                >
                  {tab.toUpperCase()}
                </button>
              ))}
            </div>
            <BulkActions />
            <ProductList />
          </div>
        )
      )}
    </>
  );
}

export default CatalogConfig;
