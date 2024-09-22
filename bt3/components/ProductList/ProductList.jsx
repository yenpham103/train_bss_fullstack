import React, { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import clsx from 'clsx';
import { toast } from 'react-toastify';
import { formatUSD } from '@/utils/formatters/currencyFormatter';
import {
  selectorActiveTab,
  selectorProducts,
  selectorSelectedProducts,
  setSelectedProduct,
  // updateProductPrice,
} from '@/slices/productsSlice';
import styles from './ProductList.module.css';
import Image from 'next/image';
import { updateProductPrice } from '@/slices/productsThunk';

function ProductList() {
  const products = useSelector(selectorProducts);
  const selectedProducts = useSelector(selectorSelectedProducts);
  const currentActiveTab = useSelector(selectorActiveTab);
  console.log(products);

  const dispatch = useDispatch();
  const [editingPrice, setEditingPrice] = useState(null);
  const [tempPrice, setTempPrice] = useState('');
  const priceInputRef = useRef(null);

  const filteredProducts = products?.filter((product) => {
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
    setTempPrice(price);
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
        const oldPrice = parseFloat(currentProduct.price);

        if (newPrice !== oldPrice) {
          dispatch(updateProductPrice({ id, price: newPrice }));
          toast.success('Price updated successfully.');
        } else {
          toast.info('No change in price.');
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
        styles['product-list'],
        filteredProducts?.length === 1 && styles['single-product']
      )}
    >
      {filteredProducts?.map((product) => (
        <div key={product.id} className={styles['product-item']}>
          <input
            type='checkbox'
            checked={selectedProducts.includes(product.id)}
            onChange={() => handleCheckbox(product.id)}
          />
          <Image
            onClick={() => handleCheckbox(product.id)}
            src={product.image}
            width={80}
            height={80}
            alt={product.name}
            className={styles['product-image']}
          />
          <span className={styles['product-name']}>{product.name}</span>
          {editingPrice === product.id ? (
            <input
              type='number'
              className={clsx(
                styles['price-input'],
                editingPrice && styles['active']
              )}
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
              className={styles['product-price']}
              onClick={() => startEditing(product.id, product.price)}
            >
              {formatUSD(product.price)}
            </span>
          )}
          <span className={styles['product-status']}>
            {product.status || 'Not set'}
          </span>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
