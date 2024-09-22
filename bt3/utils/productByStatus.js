export const getProductsByStatus = (products, status) => {
  if (status === 'all') return products;
  return products?.filter((product) => product.status === status);
};
