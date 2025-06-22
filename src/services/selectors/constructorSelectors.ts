import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Создаем селекторы для constructorSlice
// Базовый селектор состояния
const selectConstructorState = (state: RootState) => state.burgerConstructor;

// Остальные селекторы с использованием базового
const selectConstructorBun = createSelector(
  [selectConstructorState],
  (constructor) => constructor.bun
);

const selectConstructorIngredients = createSelector(
  [selectConstructorState],
  (constructor) => constructor.ingredients
);

// Экспортируем селекторы и базовое состояние
export const constructorSelectors = {
  state: selectConstructorState,
  bun: selectConstructorBun,
  ingredients: selectConstructorIngredients
};
