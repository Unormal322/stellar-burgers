import { combineReducers, configureStore } from '@reduxjs/toolkit';
import ingredientsSlice from './slices/ingredientsSlice';
import constructorSlice from './slices/constructorSlice';
import orderSlice from './slices/ordersSlice';
import userSlice from './slices/userSlice';

import {
  TypedUseSelectorHook,
  useDispatch as dispatchHook,
  useSelector as selectorHook
} from 'react-redux';

const rootReducer = combineReducers({
  ingredients: ingredientsSlice,
  burgerConstructor: constructorSlice,
  order: orderSlice,
  user: userSlice
});

const store = configureStore({
  reducer: rootReducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type RootState = ReturnType<typeof rootReducer>;

export type AppDispatch = typeof store.dispatch;

export const useDispatch: () => AppDispatch = () => dispatchHook();
export const useSelector: TypedUseSelectorHook<RootState> = selectorHook;

export default store;
