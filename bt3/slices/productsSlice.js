import { getProductsByStatus } from '@/utils/productByStatus';
import { createSlice } from '@reduxjs/toolkit';

import {
  getProducts,
  searchProducts,
  updateProductPrice,
  updateProductStatus,
} from './productsThunk';

//Slice
export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProducts: [],
    status: 'idle',
    currentPage: 1,
    totalPages: 1,
    search: '',
    activeTab: 'all',
    error: '',
  },
  reducers: {
    // Dùng khi không phải tác vụ bất đồng bộ
    setSelectedProduct: (state, action) => {
      const id = action.payload;
      const index = state.selectedProducts.indexOf(id);
      if (index === -1) {
        state.selectedProducts.push(id);
      } else {
        state.selectedProducts = state.selectedProducts.filter(
          (productId) => productId !== id
        );
      }
    },
    selectAllProducts: (state) => {
      const productsInActiveTab = getProductsByStatus(
        state.products,
        state.activeTab
      );
      const idsInActiveTab = productsInActiveTab.map((product) => product.id);
      state.selectedProducts = state.selectedProducts.concat(
        idsInActiveTab.filter((id) => !state.selectedProducts.includes(id))
      );
    },
    deselectAllProducts: (state) => {
      const productsInActiveTab = getProductsByStatus(
        state.products,
        state.activeTab
      );
      const idsInActiveTab = productsInActiveTab.map((product) => product.id);
      state.selectedProducts = state.selectedProducts.filter(
        (id) => !idsInActiveTab.includes(id)
      );
    },
    setCurrentPage: (state, action) => {
      state.currentPage = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    setError: (state, action) => {
      console.log(action.payload);

      state.error = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getProducts
    builder.addCase(getProducts.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.products = action.payload.products;
      state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalItems = action.payload.totalItems;
    });
    builder.addCase(getProducts.rejected, (state) => {
      state.status = 'rejected';
    });

    //updateProductStatus
    builder.addCase(updateProductStatus.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(updateProductStatus.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      const updatedProductIds = action.payload.map((product) => product.id);
      state.products = state.products.map((product) =>
        updatedProductIds.includes(product.id)
          ? {
              ...product,
              status: action.payload.find((p) => p.id === product.id).status,
            }
          : product
      );
      state.selectedProducts = [];
    });
    builder.addCase(updateProductStatus.rejected, (state) => {
      state.status = 'rejected';
    });

    //updateProductPrice
    builder.addCase(updateProductPrice.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(updateProductPrice.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      const updatedProduct = action.payload.product;
      const index = state.products.findIndex((p) => p.id === updatedProduct.id);
      if (index !== -1) {
        state.products[index] = {
          ...state.products[index],
          ...updatedProduct,
        };
      }
    });
    builder.addCase(updateProductPrice.rejected, (state) => {
      state.status = 'rejected';
    });

    //Search
    builder.addCase(searchProducts.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(searchProducts.fulfilled, (state, action) => {
      console.log(action.payload);
      state.status = 'fulfilled';
      state.products = action.payload.products;
      // state.currentPage = action.payload.currentPage;
      state.totalPages = action.payload.totalPages;
      state.totalItems = action.payload.totalItems;
    });
    builder.addCase(searchProducts.rejected, (state) => {
      state.status = 'rejected';
    });
  },
});
export const {
  setSelectedProduct,
  selectAllProducts,
  deselectAllProducts,
  setCurrentPage,
  setActiveTab,
  setError,
} = productsSlice.actions;

//Selector
export const selectorProducts = (state) => state.products.products;
export const selectorStatus = (state) => state.products.status;
export const selectorSelectedProducts = (state) =>
  state.products.selectedProducts;
export const selectorCurrentPage = (state) => state.products.currentPage;
export const selectorSearch = (state) => state.products.search;
export const selectorActiveTab = (state) => state.products.activeTab;
export const selectorTotalPages = (state) => state.products.totalPages;
export const selectorError = (state) => state.products.error;
