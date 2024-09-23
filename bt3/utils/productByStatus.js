export const getProductsByStatus = (products, status) => {
  if (!Array.isArray(products)) {
    return [];
  }
  console.log('Da chay vao day');

  if (status === 'all') {
    return products;
  }

  return products.filter((product) => product.status === status);
};
