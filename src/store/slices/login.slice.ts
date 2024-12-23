import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { User } from '../../types/User';

export type LoginState = {
  user: User | null;
};

const initialState: LoginState = {
  user: null,
};

const loginSlice = createSlice({
  name: 'login',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
    },
  },
});

export const { setUser } = loginSlice.actions;
export default loginSlice.reducer;
