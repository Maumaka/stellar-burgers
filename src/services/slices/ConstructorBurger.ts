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
    // добавление ингредиента, для не-bun генерируем внутренний id
    addIngredient: (
      state,
      action: PayloadAction<TIngredient | TConstructorIngredient>
    ) => {
      const payload = action.payload as any;
      if (payload?.type === 'bun') {
        // сохраняем булку
        state.constructor.bun = payload as TConstructorIngredient;
      } else {
        // создаём элемент конструктора с id
        const newEntry: TConstructorIngredient = {
          ...(payload as TIngredient),
          id: (payload as any).id || nanoid()
        } as TConstructorIngredient;
        state.constructor.ingredients.push(newEntry);
      }
    },

    // удаление по внутреннему id
    removeIngredient: (state, action: PayloadAction<string>) => {
      state.constructor.ingredients = state.constructor.ingredients.filter(
        (ing) => ing.id !== action.payload
      );
    },

    // переставить вниз (защита границ)
    moveDownIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const list = state.constructor.ingredients;
      if (index < 0 || index >= list.length - 1) return;
      // простая инлайновая перестановка без дополнительной функции
      [list[index], list[index + 1]] = [list[index + 1], list[index]];
    },

    // переставить вверх (защита границ)
    moveUpIngredient: (state, action: PayloadAction<number>) => {
      const index = action.payload;
      const list = state.constructor.ingredients;
      if (index <= 0 || index >= list.length) return;
      // простая инлайновая перестановка без дополнительной функции
      [list[index], list[index - 1]] = [list[index - 1], list[index]];
    },

    // флаг запроса заказа
    setOrderRequest: (state, action: PayloadAction<boolean>) => {
      state.orderRequest = action.payload;
    },

    // очистка данных модалки заказа
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

/* экспорт начального состояния (как раньше) */
export { stateSeed as constructorInitialState };

/* дефолтный редьюсер */
export default constructorSlice.reducer;

/* экшены (оставлены оригинальные имена) */
export const {
  addIngredient,
  removeIngredient,
  moveDownIngredient,
  moveUpIngredient,
  setOrderRequest,
  clearOrderModalData
} = constructorSlice.actions;

/* селекторы — возвращают часть state (корректируйте key в store если нужно) */
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

/* экспорт селекторов (оригинальные имена сохранены) */
export {
  constructorStateSelector,
  constructorDataSelector,
  orderRequestSelector,
  orderModalDataSelector
};
