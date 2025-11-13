import { getOrderByNumberApi, getOrdersApi } from '@api';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';

export const getOrdersThunk = createAsyncThunk(
  'feed/get-orders',
  async () => await getOrdersApi()
);
export const getOrderThunk = createAsyncThunk(
  'feed/get-order',
  async (number: number) => await getOrderByNumberApi(number)
);

export interface OrdersStoreState {
  loading: boolean;
  orders: TOrder[];
  order: TOrder | null;
  error: string | null;
}

const storeSeed: OrdersStoreState = {
  loading: false,
  orders: [],
  order: null,
  error: null
};

export const orderSlice = createSlice({
  name: 'order',
  initialState: storeSeed,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrdersThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrdersThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      })
      .addCase(getOrdersThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.error = null;
      })
      .addCase(getOrderThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getOrderThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      })
      .addCase(getOrderThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        const payload = action.payload as { orders?: TOrder[] };
        state.order = payload?.orders?.[0] ?? null;
      });
  }
});

export default orderSlice.reducer;

interface RootState {
  order?: OrdersStoreState;
}

const pickOrderSlice = (state: RootState) => state?.order ?? storeSeed;
const selectOrders = (state: RootState) => pickOrderSlice(state).orders;
const selectOrder = (state: RootState) => pickOrderSlice(state).order;
const selectOrderLoading = (state: RootState) => pickOrderSlice(state).loading;

export {
  pickOrderSlice as ordersStateSelector,
  selectOrders as ordersDataSelector,
  selectOrder as orderDataSelector,
  selectOrderLoading as ordersLoadingSelector
};
