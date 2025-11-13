import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IngredientsStoreState {
  loading: boolean;
  items: TIngredient[];
  error: string | null;
}

const initialState: IngredientsStoreState = {
  loading: false,
  items: [],
  error: null
};

export const fetchIngredientsThunk = createAsyncThunk(
  'ingredients/fetch',
  getIngredientsApi
);
export const getIngredientsThunk = fetchIngredientsThunk;

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredientsThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredientsThunk.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message ?? null;
      })
      .addCase(fetchIngredientsThunk.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        state.error = null;
      });
  }
});

export default ingredientsSlice.reducer;

interface RootState {
  ingredients?: IngredientsStoreState;
}

const pickIngredientsSlice = (state: RootState): IngredientsStoreState =>
  state?.ingredients ?? initialState;

const selectIngredientsItems = (state: RootState) =>
  pickIngredientsSlice(state).items;

export {
  pickIngredientsSlice as ingredientsStateSelector,
  selectIngredientsItems as ingredientsDataSelector
};
