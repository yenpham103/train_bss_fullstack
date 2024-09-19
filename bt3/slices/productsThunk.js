//Fetch Api
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const apiUrl = 'http://localhost:3000/api/products';
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

export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ ids, status }, { dispatch, getState, rejectWithValue }) => {
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      toast.error('API Key is not configured');
      return rejectWithValue('API Key is missing in .env file');
    }

    try {
      const updatePromises = ids.map(async (id) => {
        try {
          const response = await fetch('/api/products', {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
              'X-Request-Time': Date.now().toString(),
              'X-Api-Key': apiKey,
            },
            body: JSON.stringify({ id, status }),
          });

          if (!response.ok) {
            throw new Error(`Failed to update product ${id}`);
          }

          return await response.json();
        } catch (error) {
          console.error(`Error updating product ${id}:`, error);
        }
      });

      const updatedProducts = await Promise.all(updatePromises);
      toast.success(
        `${ids.length} products updated to ${status} successfully!`
      );

      // Dispatch để tải lại dữ liệu
      const currentState = getState().products;

      dispatch(
        getProducts({
          page: currentState.currentPage,
          status: currentState.activeTab,
        })
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
    const apiKey = process.env.NEXT_PUBLIC_API_KEY;
    if (!apiKey) {
      toast.error('API Key is not configured');
      return rejectWithValue('API Key is missing in .env file');
    }

    try {
      const response = await fetch('/api/products', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'X-Request-Time': Date.now().toString(),
          'X-Api-Key': apiKey,
        },
        body: JSON.stringify({ id, price }),
      });

      if (!response.ok) {
        throw new Error(`Failed to update product ${id}`);
      }
      toast.success(`Product ${id} updated price successfully!`);
      const updatedProduct = await response.json();

      return updatedProduct;
    } catch (error) {
      toast.error(`Failed to update product price: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ search, status = 'all' }, { rejectWithValue }) => {
    try {
      const apiKey = process.env.NEXT_PUBLIC_API_KEY;
      if (!apiKey) {
        throw new Error('API key is not defined');
      }
      const response = await fetch(
        `${apiUrl}?status=${status}&search=${encodeURIComponent(
          search.trim()
        )}`,
        {
          headers: {
            'X-Request-Time': Date.now().toString(),
            'X-Api-Key': apiKey,
          },
        }
      );
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          `${errorData.error}: ${errorData.details || 'No additional details'}`
        );
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return rejectWithValue(error.message);
    }
  }
);
