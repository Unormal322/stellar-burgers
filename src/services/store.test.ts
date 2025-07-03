import store, { rootReducer } from './store';

describe('Redux store', () => {
  const expectedKeys = ['ingredients', 'burgerConstructor', 'order', 'user'];

  test('Проверяем инициализацию store и rootReducer', () => {
    const state = store.getState();
    const stateFromReducer = rootReducer(undefined, { type: 'anyAction' });

    // Проверка структуры и начального состояния
    expect(state).toEqual(stateFromReducer);
    expect(typeof state).toBe('object');
    expect(state).not.toBeNull();
    expect(Object.keys(state).sort()).toEqual(expectedKeys.sort());
    expectedKeys.forEach(key => expect(state).toHaveProperty(key));
  });
});
