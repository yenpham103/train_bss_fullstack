import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { getProductsByStatus } from '../../utils/productByStatus';
// const apiUrl = import.meta.env.VITE_API_URL;
const apiUrl = 'http://localhost:4000';

//Slice
export const productsSlice = createSlice({
  name: 'products',
  initialState: {
    products: [],
    selectedProducts: [],
    status: 'idle',
    activeTab: 'all',
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
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
  },
  extraReducers: (builder) => {
    //getProducts
    builder.addCase(getProducts.pending, (state) => {
      state.status = 'pending';
    });
    builder.addCase(getProducts.fulfilled, (state, action) => {
      state.status = 'fulfilled';
      state.products = action.payload;
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
      state.products = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            price: action.payload.price,
          };
        }
        return product;
      });
      state.selectedProducts = [];
    });
    builder.addCase(updateProductPrice.rejected, (state) => {
      state.status = 'rejected';
    });
  },
});
export const {
  setSelectedProduct,
  selectAllProducts,
  deselectAllProducts,
  setActiveTab,
} = productsSlice.actions;

//Fetch Api

//getProducts
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/products`);
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//updateProductStatus
export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ ids, status }, { rejectWithValue }) => {
    try {
      const updatePromises = ids.map((id) =>
        fetch(`${apiUrl}/products/${id}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to update product ${id}`);
          }
          return response.json();
        })
      );

      const updatedProducts = await Promise.all(updatePromises);
      toast.success(
        `${ids.length} products updated to ${status} successfully!`
      );
      return updatedProducts;
    } catch (error) {
      toast.error(`Failed to update products: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

//updateProductPrice
export const updateProductPrice = createAsyncThunk(
  'products/updateProductPrice',
  async ({ id, price }, { rejectWithValue }) => {
    try {
      const response = await fetch(`${apiUrl}/products/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update product ${id}`);
      }
      return await response.json();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

//Selector
export const selectorProducts = (state) => state.products.products;
export const selectorStatus = (state) => state.products.status;
export const selectorSelectedProducts = (state) =>
  state.products.selectedProducts;
export const selectorActiveTab = (state) => state.products.activeTab;
