import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Создаем селекторы для userSlice
// Базовый селектор состояния
const selectUserState = (state: RootState) => state.user;

// Остальные селекторы с использованием базового
const selectUser = createSelector([selectUserState], (user) => user.user);

const selectIsAuth = createSelector([selectUserState], (user) => user.isAuth);

const selectUserError = createSelector([selectUserState], (user) => user.error);

// Экспортируем селекторы и базовое состояние
export const userSelectors = {
  state: selectUserState,
  user: selectUser,
  isAuth: selectIsAuth,
  error: selectUserError
};
