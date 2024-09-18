import { getProductsByStatus } from '@/utils/productByStatus';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const apiUrl = 'http://localhost:3000/api/products';
const ITEMS_PER_PAGE = 10;

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
    setSearch: (state, action) => {
      state.search = action.payload;
      state.currentPage = 1;
      state.filteredProducts = state.products.filter((product) =>
        product.name.toLowerCase().includes(action.payload.toLowerCase())
      );
      state.totalPages = Math.ceil(
        state.filteredProducts.length / ITEMS_PER_PAGE
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
      state.products = action.payload.products;
      state.filteredProducts = action.payload.products;
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
      state.products = state.products.map((product) => {
        if (product.id === action.payload.id) {
          return {
            ...product,
            price: action.payload.price,
          };
        }
        return product;
      });
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
  setCurrentPage,
  setSearch,
  setActiveTab,
} = productsSlice.actions;

//Fetch Api

//getProducts
export const getProducts = createAsyncThunk(
  'products/getProducts',
  async ({ page = 1, status = 'all' }, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not defined');
      }
      const response = await fetch(`${apiUrl}?page=${page}&status=${status}`, {
        headers: {
          'X-Request-Time': Date.now().toString(),
          'X-Api-Key': apiKey,
        },
      });

      if (!response.ok) {
        throw new Error(
          `Failed to fetch products: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      return {
        products: data.products,
        totalPages: data.totalPages,
        currentPage: data.currentPage,
        totalItems: data.totalItems,
      };
    } catch (error) {
      console.error('Error in getProducts:', error);
      return rejectWithValue(error.message);
    }
  }
);
//updateProductStatus
// export const updateProductStatus = createAsyncThunk(
//   'products/updateProductStatus',
//   async ({ ids, status }, { rejectWithValue }) => {
//     try {
//       const updatePromises = ids.map((id) =>
//         fetch(`${apiUrl}/products/${id}`, {
//           method: 'PATCH',
//           headers: {
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({ status }),
//         }).then((response) => {
//           if (!response.ok) {
//             throw new Error(`Failed to update product ${id}`);
//           }
//           return response.json();
//         })
//       );
//       const updatedProducts = await Promise.all(updatePromises);
//       toast.success(
//         `${ids.length} products updated to ${status} successfully!`
//       );
//       return updatedProducts;
//     } catch (error) {
//       toast.error(`Failed to update products: ${error.message}`);
//       return rejectWithValue(error.message);
//     }
//   }
// );

export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ ids, status }, { rejectWithValue }) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      toast.error('API Key is not configured');
      return rejectWithValue('API Key is missing in .env file');
    }

    try {
      const updatePromises = ids.map((id) => {
        return fetch('/api/products', {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'X-Request-Time': Date.now().toString(),
            'X-Api-Key': apiKey,
          },
          body: JSON.stringify({ id, status }),
        }).then((response) => {
          if (!response.ok) {
            throw new Error(`Failed to update product ${id}`);
          }
          return response.json();
        });
      });

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
export const selectCurrentPage = (state) => state.products.currentPage;
export const selectSearch = (state) => state.products.search;
export const selectorActiveTab = (state) => state.products.activeTab;
