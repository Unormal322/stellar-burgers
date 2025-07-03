import reducer, { fetchIngredients } from '../slices/ingredientsSlice';

describe('Проверяем редьюсер ингредиентов', () => {
  // Создаем мок для ингредиентов
  const mockIngredients = [
    { name: 'Краторная булка' },
    { name: 'Говяжий метеорит (отбивная)' }
  ];

  // Создаем мок для начального состояния
  const initialState = {
    items: [],
    loading: false,
    error: null
  };

  // Создаем мок для ошибки
  const mockError = (type: string, message: string) => ({ type, error: { message } });

  test('Проверяем возвращает ли начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('pending экшен устанавливает loading в true и error в null', () => {
    const action = { type: fetchIngredients.pending.type };
    const state = reducer(initialState, action);
    expect(state.loading).toBe(true);
    expect(state.error).toBeNull();
  });

  test('fulfilled экшен записывает данные и loading в false', () => {
    const action = { type: fetchIngredients.fulfilled.type, payload: mockIngredients };
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.items).toEqual(mockIngredients);
    expect(state.loading).toBe(false);
  });

  test('rejected экшен записывает ошибку и loading в false', () => {
    const action = mockError(fetchIngredients.rejected.type, 'Ингредиенты не найдены');
    const state = reducer({ ...initialState, loading: true }, action);
    expect(state.error).toBe('Ингредиенты не найдены');
    expect(state.loading).toBe(false);
  });
});
