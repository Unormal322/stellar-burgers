import reducer, { createOrder, fetchOrderByNumber, fetchFeeds, fetchUserOrders } from '../slices/ordersSlice';

describe('Проверяем редьюсер заказов', () => {
  // Создаем моки для заказов
  const mockOrder = { number: 123, name: 'Тестовый заказ' };
  const mockOrderByNumber = { number: 456, name: 'Заказ по номеру' };
  const mockOrders = [
    { number: 789, name: 'Заказ 1' },
    { number: 101, name: 'Заказ 2' }
  ];
  const mockUserOrders = [
    { number: 111, name: 'Заказ пользователя 1' },
    { number: 222, name: 'Заказ пользователя 2' }
  ];

  // Создаем мок для ошибки
  const mockError = (type: string, message: string) => ({ type, error: { message } });

  // Создаем мок для начального состояния
  const initialState = {
    orderRequest: false,
    orderModalData: null,
    currentOrder: null,
    feeds: null,
    userOrders: null,
    error: null
  };

  // Сообщения об ошибках
  const errorMessages = {
    createOrderError: 'Ошибка создания заказа',
    fetchOrderByNumberError: 'Ошибка поиска заказа',
    fetchFeedsError: 'Ошибка получения списка заказов',
    fetchUserOrdersError: 'Ошибка получения заказов пользователя'
  };

  test('Проверяет возвращает ли начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('Создание заказа', () => {
    const action = { type: createOrder.fulfilled.type, payload: mockOrder };
    const state = reducer(initialState, action);
    expect(state.currentOrder).toEqual(mockOrder);
    expect(state.orderModalData).toEqual(mockOrder);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Ошибка при создании заказа', () => {
    const action = mockError(createOrder.rejected.type, errorMessages.createOrderError);
    const state = reducer({ ...initialState, orderRequest: true }, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessages.createOrderError);
  });

  test('Получение заказа по номеру', () => {
    const action = { type: fetchOrderByNumber.fulfilled.type, payload: mockOrderByNumber };
    const state = reducer(initialState, action);
    expect(state.orderModalData).toEqual(mockOrderByNumber);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Ошибка при получении заказа по номеру', () => {
    const action = mockError(fetchOrderByNumber.rejected.type, errorMessages.fetchOrderByNumberError);
    const state = reducer({ ...initialState, orderRequest: true }, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessages.fetchOrderByNumberError);
  });

  test('Получение списка заказов', () => {
    const action = { type: fetchFeeds.fulfilled.type, payload: mockOrders };
    const state = reducer(initialState, action);
    expect(state.feeds).toEqual(mockOrders);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Ошибка при получении списка заказов', () => {
    const action = mockError(fetchFeeds.rejected.type, errorMessages.fetchFeedsError);
    const state = reducer({ ...initialState, orderRequest: true }, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessages.fetchFeedsError);
  });

  test('Получение заказов пользователя', () => {
    const action = { type: fetchUserOrders.fulfilled.type, payload: mockUserOrders };
    const state = reducer(initialState, action);
    expect(state.userOrders).toEqual(mockUserOrders);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBeNull();
  });

  test('Ошибка при получении заказов пользователя', () => {
    const action = mockError(fetchUserOrders.rejected.type, errorMessages.fetchUserOrdersError);
    const state = reducer({ ...initialState, orderRequest: true }, action);
    expect(state.orderRequest).toBe(false);
    expect(state.error).toBe(errorMessages.fetchUserOrdersError);
  });
});
