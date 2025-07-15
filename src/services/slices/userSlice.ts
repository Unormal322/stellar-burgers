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
import { setCookie, deleteCookie, getCookie } from '../../utils/cookie';
import { AppDispatch } from '../store';

type TUserState = {
  authChecked: boolean;
  user: TUser | null;
  error: string | null;
};

export const initialState: TUserState = {
  authChecked: false,
  user: null,
  error: null
};

export const getUser = createAsyncThunk(
  'user/getUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserApi();
      return response.user;
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      if (errorMessage?.includes('401')) {
        return rejectWithValue('unauthorized');
      }
      return rejectWithValue(errorMessage);
    }
  }
);

export const authChecked = () => ({
  type: 'user/authChecked' as const
});

export const checkUserAuth = () => (dispatch: AppDispatch) => {
  if (getCookie('accessToken')) {
    dispatch(getUser()).finally(() => {
      dispatch(authChecked());
    });
  } else {
    dispatch(authChecked());
  }
};

export const loginUser = createAsyncThunk(
  'user/login',
  async (login: TLoginData) => {
    const response = await loginUserApi(login);
    setCookie('accessToken', response.accessToken);
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
      .addCase(getUser.pending, (state) => {
        state.error = null;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.authChecked = true;
        state.user = action.payload;
      })
      .addCase(getUser.rejected, (state, action) => {
        state.authChecked = true;
        state.error =
          action.error.message || 'Произошла ошибка при получении пользователя';
      })
      .addCase(loginUser.pending, (state) => {
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.authChecked = true;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.authChecked = true;
        state.error =
          action.error.message || 'Произошла ошибка при входе в аккаунт';
      })
      .addCase(registerUser.pending, (state) => {
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.authChecked = true;
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.authChecked = true;
        state.error =
          action.error.message || 'Произошла ошибка при регистрации';
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.authChecked = true;
        state.user = action.payload;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.authChecked = true;
        state.error =
          action.error.message || 'Произошла ошибка при обновлении профиля';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.authChecked = true;
        state.user = null;
      })
      .addCase('user/authChecked', (state) => {
        state.authChecked = true;
      });
  }
});

export default userSlice.reducer;
