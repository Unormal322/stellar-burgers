import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { TIngredient } from '@utils-types';

// Создаем селекторы для ingredientsSlice
// Базовый селектор состояния
const selectIngredientsState = (state: RootState) => state.ingredients;

// Остальные селекторы с использованием базового
const selectIngredients = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.items
);

const selectIngredientsLoading = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.loading
);

const selectIngredientsError = createSelector(
  [selectIngredientsState],
  (ingredients) => ingredients.error
);

const selectBuns = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item: TIngredient) => item.type === 'bun')
);

const selectMains = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item: TIngredient) => item.type === 'main')
);

const selectSauces = createSelector([selectIngredients], (ingredients) =>
  ingredients.filter((item: TIngredient) => item.type === 'sauce')
);

// Создаем комбинированный селектор
const selectIngredientById = (id: string) =>
  createSelector([selectIngredients], (ingredients) =>
    ingredients.find((item) => item._id === id)
  );

// Экспортируем селекторы и базовое состояние
export const ingredientsSelectors = {
  state: selectIngredientsState,
  items: selectIngredients,
  loading: selectIngredientsLoading,
  error: selectIngredientsError,
  buns: selectBuns,
  mains: selectMains,
  sauces: selectSauces,
  selectIngredientById: selectIngredientById
};
