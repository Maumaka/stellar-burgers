import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

export interface IngredientsStoreState {
  loading: boolean;
  items: TIngredient[];
  error: string | null;
}

const pantrySeed: IngredientsStoreState = {
  loading: false,
  items: [],
  error: null
};

/* экспортируем начальное состояние под старым именем для совместимости */
export const initialState: IngredientsStoreState = pantrySeed;

/* thunk для загрузки ингредиентов */
export const fetchIngredientsThunk = createAsyncThunk(
  'ingredients/fetch',
  getIngredientsApi
);
export const getIngredientsThunk = fetchIngredientsThunk;

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: pantrySeed,
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

type RootState = any;
/* внутренний селектор, возвращает срез стора */
const pickIngredientsSlice = (state: RootState): IngredientsStoreState =>
  state?.ingredients ?? (state as any);

/* экспортируем селекторы под прежними публичными именами */
const selectIngredientsItems = (state: RootState) =>
  pickIngredientsSlice(state).items;

export {
  pickIngredientsSlice as ingredientsStateSelector,
  selectIngredientsItems as ingredientsDataSelector
};
