import type { PayloadAction } from '@reduxjs/toolkit';
import { createSelector, createSlice } from '@reduxjs/toolkit';

import { getToken } from './shared';

const initialState = {
  token: getToken()
};

export const authSlice = createSlice({
  initialState,
  name: 'auth',
  reducers: {
    resetAuth: () => initialState,
    setToken: (state, { payload }: PayloadAction<string>) => {
      state.token = payload;
    }
  },
  selectors: {
    selectToken: auth => auth.token
  }
});

export const { resetAuth, setToken } = authSlice.actions;

export const { selectToken } = authSlice.selectors;

/** Is login */
export const getIsLogin = createSelector([selectToken], token => Boolean(token));
