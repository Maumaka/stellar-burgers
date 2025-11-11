import { getFeedsApi } from '@api';
import { TOrder } from '@utils-types';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export const fetchFeedsThunk = createAsyncThunk(
  'feed/get-feeds',
  async () => await getFeedsApi()
);
export const getFeedsThunk = fetchFeedsThunk;

export interface FeedStoreState {
  loading: boolean;
  orders: TOrder[];
  total: number;
  totalToday: number;
  error: string | null;
}

const feedSeed: FeedStoreState = {
  loading: false,
  orders: [],
  total: 0,
  totalToday: 0,
  error: null
};

export const feedSlice = createSlice({
  name: 'feed',
  initialState: feedSeed,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFeedsThunk.pending, (state) => {
        state.loading = true; // загрузка
        state.error = null; // сброс ошибки
      })
      .addCase(fetchFeedsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      })
      .addCase(
        fetchFeedsThunk.fulfilled,
        (state, action: PayloadAction<any>) => {
          state.loading = false;
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.error = null;
        }
      );
  }
});

type RootState = any;
const pickFeedSlice = (state: RootState) => state?.feed ?? (state as any);

const selectFeedData = (state: RootState) => pickFeedSlice(state).orders;
const selectFeedTotal = (state: RootState) => pickFeedSlice(state).total;
const selectFeedTotalToday = (state: RootState) =>
  pickFeedSlice(state).totalToday;
const selectFeedLoading = (state: RootState) => pickFeedSlice(state).loading;

export default feedSlice.reducer;

export {
  pickFeedSlice as feedStateSelector,
  selectFeedData as feedDataSelector,
  selectFeedTotal as feedTotalSelector,
  selectFeedTotalToday as feedTotalTodaySelector,
  selectFeedLoading as feedLoadingSelector
};
