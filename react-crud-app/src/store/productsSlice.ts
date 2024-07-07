import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../utils/api';
import { IProduct } from '../types/IProduct';


interface ProductsState {
  products: IProduct[];
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk('products/fetchProducts', async () => {
  const response = await api.get('/products');
  return response.data;
});

export const addProduct = createAsyncThunk('products/create', async (product: IProduct) => {
  const response = await api.post('/products', product);
  return response.data;
});

export const updateProduct = createAsyncThunk('products/updateProduct', async (product: IProduct) => {
  const response = await api.put(`/products/${product.id}`, product);
  return response.data;
});

export const deleteProduct = createAsyncThunk('products/deleteProduct', async (id: string) => {
  await api.delete(`/products/${id}`);
  return id;
});

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<IProduct[]>) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch products';
      })
      .addCase(addProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        state.products.push(action.payload);
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<IProduct>) => {
        const index = state.products.findIndex(product => product.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<string>) => {
        state.products = state.products.filter(product => product.id !== action.payload);
      });
  },
});

export default productsSlice.reducer;
