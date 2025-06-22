import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder, TOrdersData } from '@utils-types';
import {
  orderBurgerApi,
  getOrderByNumberApi,
  getFeedsApi,
  getOrdersApi
} from '@api';

interface IOrderState {
  orderRequest: boolean;
  orderModalData: TOrder | null;
  currentOrder: TOrder | null;
  feeds: TOrdersData | null;
  userOrders: TOrder[] | null;
  error: string | null;
}

const initialState: IOrderState = {
  orderRequest: false,
  orderModalData: null,
  currentOrder: null,
  feeds: null,
  userOrders: null,
  error: null
};

export const createOrder = createAsyncThunk(
  'order/createOrder',
  async (ingredients: string[]) => {
    const response = await orderBurgerApi(ingredients);
    return response.order;
  }
);

export const fetchOrderByNumber = createAsyncThunk(
  'order/fetchOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const fetchFeeds = createAsyncThunk('order/fetchFeeds', getFeedsApi);

export const fetchUserOrders = createAsyncThunk(
  'order/fetchUserOrders',
  getOrdersApi
);

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {
    setOrderModalData: (state, action: PayloadAction<TOrder>) => {
      state.orderModalData = action.payload;
    },
    clearOrderModalData: (state) => {
      state.orderModalData = null;
    },
    resetCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearOrderError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.currentOrder = action.payload;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message || 'Произошла ошибка при создании заказа';
      })
      .addCase(fetchOrderByNumber.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchOrderByNumber.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(fetchOrderByNumber.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message || 'Произошла ошибка при загрузке заказа';
      })
      .addCase(fetchFeeds.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchFeeds.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.feeds = action.payload;
      })
      .addCase(fetchFeeds.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message || 'Произошла ошибка при загрузке заказов';
      })
      .addCase(fetchUserOrders.pending, (state) => {
        state.orderRequest = true;
        state.error = null;
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.userOrders = action.payload;
      })
      .addCase(fetchUserOrders.rejected, (state, action) => {
        state.orderRequest = false;
        state.error =
          action.error.message ||
          'Произошла ошибка при загрузке заказов пользователя';
      });
  }
});

export const {
  setOrderModalData,
  clearOrderModalData,
  resetCurrentOrder,
  clearOrderError
} = orderSlice.actions;

export default orderSlice.reducer;
