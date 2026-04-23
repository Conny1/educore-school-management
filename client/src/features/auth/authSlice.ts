import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TokenState {
  value: {
    accessToken: string | null;
    refreshToken: string | null;
    _id: string | null;
  };
}

const initialState: TokenState = {
  value: {
    accessToken: localStorage.getItem('accessToken'),
    refreshToken: localStorage.getItem('refreshToken'),
    _id: localStorage.getItem('user_id'),
  },
};

const tokenSlice = createSlice({
  name: 'token',
  initialState,
  reducers: {
    updateTokenData: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; _id: string }>
    ) => {
      state.value = action.payload;
      localStorage.setItem('accessToken', action.payload.accessToken);
      localStorage.setItem('refreshToken', action.payload.refreshToken);
      localStorage.setItem('user_id', action.payload._id);
    },
    clearToken: (state) => {
      state.value = {
        accessToken: null,
        refreshToken: null,
        _id: null,
      };
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user_id');
    },
  },
});

export const { updateTokenData, clearToken } = tokenSlice.actions;
export default tokenSlice.reducer;
