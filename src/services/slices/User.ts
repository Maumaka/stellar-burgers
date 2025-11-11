import { deleteCookie, setCookie } from '../../utils/cookie';
import { TUser } from '@utils-types';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  forgotPasswordApi,
  getUserApi,
  loginUserApi,
  logoutApi,
  registerUserApi,
  resetPasswordApi,
  TLoginData,
  TRegisterData,
  updateUserApi
} from '@api';

export const loginUserThunk = createAsyncThunk(
  'user/login',
  async (loginData: TLoginData) => {
    const data = await loginUserApi(loginData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data;
  }
);

export const logoutUserThunk = createAsyncThunk(
  'user/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutApi();
      deleteCookie('accessToken');
      localStorage.removeItem('refreshToken');
      return;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const registerUserThunk = createAsyncThunk(
  'user/register',
  async (registerData: TRegisterData) => {
    const data = await registerUserApi(registerData);
    setCookie('accessToken', data.accessToken);
    localStorage.setItem('refreshToken', data.refreshToken);
    return data.user;
  }
);

export const forgotPasswordThunk = createAsyncThunk(
  'user/forgot-password',
  async (payload: { email: string }) => {
    const res = await forgotPasswordApi(payload);
    return res;
  }
);

export const resetPasswordThunk = createAsyncThunk(
  'user/reset-password',
  async (payload: { password: string; token: string }) =>
    await resetPasswordApi(payload)
);

export const updateUserThunk = createAsyncThunk(
  'user/update',
  async (user: TUser) => await updateUserApi(user)
);

export const getUserThunk = createAsyncThunk(
  'user/get',
  async () => await getUserApi()
);

export interface UserStoreState {
  isLoad: boolean;
  user: TUser | null; // null — неавторизован
  isAuth: boolean;
  loginUserError: null | string; // ошибка аутентификации
  isAuthChecked: boolean; // флаг завершённой проверки авторизации
}

const storeSeed: UserStoreState = {
  isLoad: false,
  user: null,
  isAuth: false,
  loginUserError: null,
  isAuthChecked: false
};

export const userSlice = createSlice({
  name: 'user',
  initialState: storeSeed,
  reducers: {
    clearUserError: (state) => {
      state.loginUserError = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(loginUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error?.message ?? null;
      })
      .addCase(loginUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload.user;
        state.isAuth = true;
      })

      .addCase(logoutUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(logoutUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error?.message ?? null;
      })
      .addCase(logoutUserThunk.fulfilled, (state) => {
        state.isLoad = false;
        state.user = null;
        state.isAuth = false;
        state.loginUserError = null;
      })

      .addCase(registerUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(registerUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error?.message ?? null;
      })
      .addCase(registerUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload;
        state.isAuth = true;
      })

      .addCase(forgotPasswordThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(forgotPasswordThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error?.message ?? null;
      })
      .addCase(forgotPasswordThunk.fulfilled, (state) => {
        state.isLoad = false;
        state.loginUserError = null;
      })

      .addCase(resetPasswordThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(resetPasswordThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error?.message ?? null;
      })
      .addCase(resetPasswordThunk.fulfilled, (state) => {
        state.isLoad = false;
        state.loginUserError = null;
      })

      .addCase(updateUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(updateUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error?.message ?? null;
      })
      .addCase(updateUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload.user;
        state.isAuth = true;
        state.loginUserError = null;
      })

      .addCase(getUserThunk.pending, (state) => {
        state.isLoad = true;
        state.loginUserError = null;
      })
      .addCase(getUserThunk.rejected, (state, action) => {
        state.isLoad = false;
        state.loginUserError = action.error?.message ?? null;
        state.isAuth = false;
        state.isAuthChecked = true;
      })
      .addCase(getUserThunk.fulfilled, (state, action) => {
        state.isLoad = false;
        state.user = action.payload.user;
        state.isAuth = true;
        state.loginUserError = null;
        state.isAuthChecked = true;
      });
  }
});

export default userSlice.reducer;
export const { clearUserError } = userSlice.actions;

type RootState = any;
const pickUserSlice = (state: RootState) => state?.user ?? (state as any);

const userStateSelector = (state: RootState) => pickUserSlice(state);
const userDataSelector = (state: RootState) => pickUserSlice(state).user;
const isAuthSelector = (state: RootState) => pickUserSlice(state).isAuth;
const isAuthCheckedSelector = (state: RootState) =>
  pickUserSlice(state).isAuthChecked;
const userErrorSelector = (state: RootState) =>
  pickUserSlice(state).loginUserError;

export {
  userStateSelector,
  userDataSelector,
  isAuthSelector,
  isAuthCheckedSelector,
  userErrorSelector
};
