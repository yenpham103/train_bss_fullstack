//Fetch Api
import { createAsyncThunk } from '@reduxjs/toolkit';
import { parseCookies } from 'nookies';
import { toast } from 'react-toastify';
import { setError } from './productsSlice';
const apiUrl = 'http://localhost:8080';
//getProducts

export const getProducts = createAsyncThunk(
  'products/getProducts',
  async (
    { page = 1, limit = 8, status = 'all' },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        status,
      });

      const response = await fetch(
        `${apiUrl}/products?${queryParams.toString()}`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(response);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
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
      dispatch(setError(error.message));
      return rejectWithValue(error);
    }
  }
);

export const updateProductStatus = createAsyncThunk(
  'products/updateProductStatus',
  async ({ ids, status }, { dispatch, getState, rejectWithValue }) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const updatePromises = ids.map(async (id) => {
        const response = await fetch(`${apiUrl}/products/${id}/status`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        });

        if (!response.ok) {
          throw new Error(`Failed to update product ${id}`);
        }

        return response.json();
      });

      const updatedProducts = await Promise.all(updatePromises);

      toast.success(
        `${ids.length} products updated to ${status} successfully!`
      );

      // Reload data
      const { currentPage, activeTab } = getState().products;
      dispatch(getProducts({ page: currentPage, status: activeTab }));

      return updatedProducts;
    } catch (error) {
      toast.error(`Failed to update products status: ${error.message}`);
      return rejectWithValue(error.message);
    }
  }
);
//updateProductPrice
export const updateProductPrice = createAsyncThunk(
  'products/updateProductPrice',
  async ({ id, price }, { dispatch, getState, rejectWithValue }) => {
    const cookies = parseCookies();
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      throw new Error('Access token not found');
    }
    try {
      if (!id || typeof id !== 'number') {
        throw new Error('Invalid product ID');
      }

      if (typeof price !== 'number' || price < 0) {
        throw new Error('Invalid price. Price must be a non-negative number');
      }

      const response = await fetch(`${apiUrl}/products/${id}/price`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ price }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.error ||
            `Failed to update product ${id}. Status: ${response.status}`
        );
      }

      const updatedProduct = await response.json();

      // Reload data
      const { currentPage, activeTab } = getState().products;
      dispatch(getProducts({ page: currentPage, status: activeTab }));

      return updatedProduct;
    } catch (error) {
      dispatch(setError(error.message));
      return rejectWithValue(error.message);
    }
  }
);

export const searchProducts = createAsyncThunk(
  'products/searchProducts',
  async ({ search = '', status = 'all' }, { rejectWithValue }) => {
    try {
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const queryParams = new URLSearchParams({
        status,
        search: search.trim(),
      }).toString();

      const response = await fetch(`${apiUrl}/products/search?${queryParams}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'An error occurred');
      }

      return await response.json();
    } catch (error) {
      console.error('Error in searchProducts:', error);
      return rejectWithValue(error.message);
    }
  }
);
