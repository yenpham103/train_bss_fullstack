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
      // Lấy accessToken từ cookie
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;
      console.log(accessToken);

      if (!accessToken) {
        throw new Error('Access token not found');
      }

      const updatePromises = ids.map(async (id) => {
        try {
          const response = await fetch(`${apiUrl}/products`, {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
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
    // Lấy accessToken từ cookie
    const cookies = parseCookies();
    const accessToken = cookies.accessToken;

    if (!accessToken) {
      throw new Error('Access token not found');
    }

    try {
      const response = await fetch(`${apiUrl}/products/price`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
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
      const cookies = parseCookies();
      const accessToken = cookies.accessToken;

      if (!accessToken) {
        throw new Error('Access token not found');
      }
      const response = await fetch(
        `${apiUrl}/products?status=${status}&search=${encodeURIComponent(
          search.trim()
        )}`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
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
