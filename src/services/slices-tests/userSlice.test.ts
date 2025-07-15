import reducer, { getUser, loginUser, registerUser, logoutUser, updateUser } from '../slices/userSlice';

describe('Проверяем редьюсер пользователя', () => {
  // Создаем мок для пользователя
  const mockUser = { name: 'User', email: 'user123@example.com' };

  // Создаем мок для ошибки
  const mockError = (type: string, message: string) => ({ type, error: { message } });

  // Создаем мок для начального состояния
  const initialState = {
    user: null,
    authChecked: false,
    error: null
  };

  // Сообщения об ошибках
  const errorMessages = {
    getUserError: 'Произошла ошибка при получении пользователя',
    loginUserError: 'Произошла ошибка при входе в аккаунт',
    registerUserError: 'Произошла ошибка при регистрации',
    updateUserError: 'Произошла ошибка при обновлении профиля'
  };

  test('Возвращает начальное состояние', () => {
    expect(reducer(undefined, { type: '' })).toEqual(initialState);
  });

  test('Получение пользователя', () => {
    const action = { type: getUser.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.authChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Ошибка при получении пользователя', () => {
    const action = mockError(getUser.rejected.type, errorMessages.getUserError);
    const state = reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.authChecked).toBe(true);
    expect(state.error).toEqual(errorMessages.getUserError);
  });

  test('Вход пользователя', () => {
    const action = { type: loginUser.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.authChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Ошибка при входе пользователя', () => {
    const action = mockError(loginUser.rejected.type, errorMessages.loginUserError);
    const state = reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.authChecked).toBe(true);
    expect(state.error).toEqual(errorMessages.loginUserError);
  });

  test('Регистрация пользователя', () => {
    const action = { type: registerUser.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.authChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Ошибка при регистрации пользователя', () => {
    const action = mockError(registerUser.rejected.type, errorMessages.registerUserError);
    const state = reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.authChecked).toBe(true);
    expect(state.error).toEqual(errorMessages.registerUserError);
  });

  test('Выход пользователя', () => {
    const action = { type: logoutUser.fulfilled.type };
    const state = reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.authChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Обновление пользователя', () => {
    const action = { type: updateUser.fulfilled.type, payload: mockUser };
    const state = reducer(initialState, action);
    expect(state.user).toEqual(mockUser);
    expect(state.authChecked).toBe(true);
    expect(state.error).toBeNull();
  });

  test('Ошибка при обновлении пользователя', () => {
    const action = mockError(updateUser.rejected.type, errorMessages.updateUserError);
    const state = reducer(initialState, action);
    expect(state.user).toBeNull();
    expect(state.authChecked).toBe(true);
    expect(state.error).toEqual(errorMessages.updateUserError);
  });
});
