import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  selectorActiveTab,
  selectorProducts,
  selectorSelectedProducts,
  setSelectedProduct,
  updateProductPrice,
} from '../../redux/slice/productsSlice';
import './ProductList.css';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { formatUSD } from '../../utils/formatters/currencyFormatter';

function ProductList() {
  const products = useSelector(selectorProducts);
  const selectedProducts = useSelector(selectorSelectedProducts);
  const currentActiveTab = useSelector(selectorActiveTab);

  const dispatch = useDispatch();
  const [editingPrice, setEditingPrice] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const priceInputRef = useRef(null);

  const filteredProducts = products.filter((product) => {
    if (currentActiveTab === 'all') return true;
    if (currentActiveTab === 'included') return product.status === 'included';
    if (currentActiveTab === 'excluded') return product.status === 'excluded';
    return false;
  });

  const handleCheckbox = (id) => {
    dispatch(setSelectedProduct(id));
  };

  const startEditing = (id, price) => {
    setEditingPrice(id);
    setTempPrice(price.toFixed(2));
  };

  const handlePriceChange = (e) => {
    setTempPrice(e.target.value);
  };

  const handlePriceUpdate = (e, id) => {
    if (e.type === 'blur' || (e.type === 'keydown' && e.key === 'Enter')) {
      e.preventDefault();
      const newPrice = parseFloat(tempPrice);
      const currentProduct = products.find((product) => product.id === id);
      if (!isNaN(newPrice) && newPrice >= 0) {
        if (newPrice !== currentProduct.price) {
          dispatch(updateProductPrice({ id, price: newPrice }));
          toast.success(
            `Price for product ${id} has been updated to $${newPrice.toFixed(
              2
            )}.`
          );
        }
      } else {
        toast.error('Invalid price. Please enter a valid number.');
      }
      setEditingPrice(null);
    } else if (e.type === 'keydown' && e.key === 'Escape') {
      setEditingPrice(null);
    }
  };

  useEffect(() => {
    if (editingPrice !== null && priceInputRef.current) {
      priceInputRef.current.focus();
    }
  }, [editingPrice]);

  return (
    <div
      className={clsx(
        'product-list',
        filteredProducts.length === 1 && 'single-product'
      )}
    >
      {filteredProducts.map((product) => (
        <div key={product.id} className={clsx('product-item')}>
          <input
            type='checkbox'
            checked={selectedProducts.includes(product.id)}
            onChange={() => handleCheckbox(product.id)}
          />
          <img
            onClick={() => handleCheckbox(product.id)}
            src={product.image}
            alt={product.name}
            loading='lazy'
          />
          <span className='product-name'>{product.name}</span>
          {editingPrice === product.id ? (
            <input
              type='number'
              className={clsx('price-input', editingPrice && 'active')}
              value={tempPrice}
              onChange={handlePriceChange}
              onBlur={(e) => handlePriceUpdate(e, product.id)}
              onKeyDown={(e) => handlePriceUpdate(e, product.id)}
              step='0.01'
              min='0'
              ref={priceInputRef}
            />
          ) : (
            <span
              className='product-price'
              onClick={() => startEditing(product.id, product.price)}
            >
              {formatUSD(product.price.toFixed(2))}
            </span>
          )}
          <span className='product-status'>{product.status || 'Not set'}</span>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
