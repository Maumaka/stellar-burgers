import { orderBurgerApi } from '@api';
import {
  createSlice,
  createAsyncThunk,
  nanoid,
  PayloadAction
} from '@reduxjs/toolkit';
import { TConstructorIngredient, TOrder, TIngredient } from '@utils-types';

export const createBurgerThunk = createAsyncThunk(
  'constructorbg/createBurger',
  async (data: string[]) => await orderBurgerApi(data)
);

export interface ConstructorStoreState {
  isLoad: boolean;
  constructor: {
    bun: TConstructorIngredient | null;
    ingredients: TConstructorIngredient[];
  };
  orderRequest: boolean;
  orderModalData: TOrder | null;
  constructorError: string | null;
}

const stateSeed: ConstructorStoreState = {
  isLoad: false,
  constructor: {
    bun: null,
    ingredients: []
  },
  orderRequest: false,
  orderModalData: null,
  constructorError: null
};

export const constructorSlice = createSlice({
  name: 'constructorbg',
  initialState: stateSeed,
  reducers: {
    addIngredient: (
      state,
      action: PayloadAction<TIngredient | TConstructorIngredient>
    ) => {
      const payload = action.payload as any;
      if (payload?.type === 'bun') {
        state.constructor.bun = payload as TConstructorIngredient;
      } else {
        const newEntry: TConstructorIngredient = {
          ...(payload as TIngredient),
          id: (payload as any).id || nanoid()
        } as TConstructorIngredient;
        state.constructor.ingredients.push(newEntry);
      }
    },

    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },

    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const list = state.constructor.ingredients;
      if (index < 0 || index >= list.length - 1) return;
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    },

    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const list = state.constructor.ingredients;
      if (index <= 0 || index >= list.length) return;
      [list[index], list[index - 1]] = [list[index - 1], list[index]];
    },

    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },

    clearOrderModalData: (state) => {
      state.orderModalData = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(createBurgerThunk.pending, (state) => {
        state.isLoad = true;
        state.constructorError = null;
      })
      .addCase(createBurgerThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.constructorError = action.error?.message ?? null;
      })
      .addCase(createBurgerThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.constructor = {
          bun: null,
          ingredients: []
        };
        state.orderRequest = false;
        state.orderModalData = (action.payload as any)?.order ?? null;
        state.constructorError = null;
      });
  }
});

export { stateSeed as constructorInitialState };

export default constructorSlice.reducer;

export const {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient,
  setOrderRequest,
  clearOrderModalData
} = constructorSlice.actions;

type RootState = any;
const getConstructorSlice = (state: RootState): ConstructorStoreState =>
  state?.constructorbg ?? (state as any);

const constructorStateSelector = (state: RootState) =>
  getConstructorSlice(state);
const constructorDataSelector = (state: RootState) =>
  getConstructorSlice(state).constructor;
const orderRequestSelector = (state: RootState) =>
  getConstructorSlice(state).orderRequest;
const orderModalDataSelector = (state: RootState) =>
  getConstructorSlice(state).orderModalData;

export {
  constructorStateSelector,
  constructorDataSelector,
  orderRequestSelector,
  orderModalDataSelector
};
