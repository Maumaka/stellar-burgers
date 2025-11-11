import {
  TypedUseSelectorHook,
  useDispatch as rawUseDispatch,
  useSelector as rawUseSelector
} from 'react-redux';
import { combineReducers, configureStore } from '@reduxjs/toolkit';
import {
  constructorSlice,
  feedSlice,
  ingredientsSlice,
  orderSlice,
  userSlice
} from '@slices';
const combinedReducer = combineReducers({
  user: userSlice.reducer,
  order: orderSlice.reducer,
  ingredients: ingredientsSlice.reducer,
  constructorbg: constructorSlice.reducer,
  feed: feedSlice.reducer
});

const appStore = configureStore({
  reducer: combinedReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof combinedReducer>;
export type AppDispatch = typeof appStore.dispatch;

export const useDispatch: () => AppDispatch = () =>
  rawUseDispatch<AppDispatch>();
export const useSelector: TypedUseSelectorHook<RootState> = rawUseSelector;

export default appStore;
