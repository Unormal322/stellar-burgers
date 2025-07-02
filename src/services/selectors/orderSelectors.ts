import { createSelector } from '@reduxjs/toolkit';
import { RootState } from '../store';

// Создаем селекторы для ordersSlice
// Базовый селектор состояния
const selectOrderState = (state: RootState) => state.order;

// Остальные селекторы с использованием базового
const selectOrderRequest = createSelector(
  [selectOrderState],
  (order) => order.orderRequest
);

const selectOrderModalData = createSelector(
  [selectOrderState],
  (order) => order.orderModalData
);

const selectCurrentOrder = createSelector(
  [selectOrderState],
  (order) => order.currentOrder
);

const selectFeeds = createSelector([selectOrderState], (order) => order.feeds);

const selectUserOrders = createSelector(
  [selectOrderState],
  (order) => order.userOrders
);

const selectOrderError = createSelector(
  [selectOrderState],
  (order) => order.error
);

// Создаем комбинированные селекторы
const selectOrders = createSelector(
  [selectFeeds, selectUserOrders],
  (feeds, userOrders) => feeds?.orders || userOrders || []
);

const selectFeedInfo = createSelector([selectFeeds], (feeds) => ({
  total: feeds?.total || 0,
  totalToday: feeds?.totalToday || 0
}));

// Экспортируем селекторы и базовое состояние
export const orderSelectors = {
  state: selectOrderState,
  request: selectOrderRequest,
  modalData: selectOrderModalData,
  currentOrder: selectCurrentOrder,
  feeds: selectFeeds,
  userOrders: selectUserOrders,
  error: selectOrderError,
  selectOrders: selectOrders,
  selectFeedInfo: selectFeedInfo
};
