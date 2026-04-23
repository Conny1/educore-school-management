import { role, User } from '@/types';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  value: User | null
}

const initialState: UserState = {
  value: null
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    updateUserData: (
      state,
      action: PayloadAction<User>
    ) => {
      state.value = action.payload;
      
    },
    clearUserData: (state) => {
      state.value =null;
    },
  },
});

export const { updateUserData, clearUserData } = userSlice.actions;
export default userSlice.reducer;
