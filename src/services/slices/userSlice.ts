import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { TUser } from '@utils-types';
import {
  getUserApi,
  loginUserApi,
  registerUserApi,
  logoutApi,
  updateUserApi,
  TLoginData,
  TRegisterData
} from '../../utils/burger-api';
import { setCookie, deleteCookie } from '../../utils/cookie';

type TUserState = {
  isAuth: boolean;
  user: TUser | null;
  error: string | null;
};

export const initialState: TUserState = {
  isAuth: false,
  user: null,
  error: null
};

export const checkUserAuth = createAsyncThunk('user/checkAuth', async () => {
  const response = await getUserApi();
  return response.user;
});

export const loginUser = createAsyncThunk(
  'user/login',
  async (login: TLoginData) => {
    const response = await loginUserApi(login);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const registerUser = createAsyncThunk(
  'user/register',
  async (register: TRegisterData) => {
    const response = await registerUserApi(register);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response.user;
  }
);

export const logoutUser = createAsyncThunk('user/logout', async () => {
  await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
});

export const updateUser = createAsyncThunk(
  'user/update',
  async (user: TRegisterData) => {
    const response = await updateUserApi(user);
    return response.user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(checkUserAuth.pending, (state) => {
        state.error = null;
      })
      .addCase(checkUserAuth.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(checkUserAuth.rejected, (state, action) => {
        state.isAuth = true;
        state.error =
          action.error.message || 'Произошла ошибка при проверке авторизации';
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isAuth = true;
        state.error =
          action.error.message || 'Произошла ошибка при входе в аккаунт';
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuth = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.error =
          action.error.message || 'Произошла ошибка при регистрации';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error =
          action.error.message || 'Произошла ошибка при обновлении профиля';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = null;
      });
  }
});

export default userSlice.reducer;
