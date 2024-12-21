import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Todo } from '../../types/Todo';

export type TempState = {
  tempTodo: Todo | null;
  pendingTodos: number[];
};

const initialState: TempState = {
  tempTodo: null,
  pendingTodos: [],
};

const tepmSlice = createSlice({
  name: 'temp',
  initialState,
  reducers: {
    addPendingTodo: (state, action: PayloadAction<number>) => {
      state.pendingTodos.push(action.payload);
    },
    removePendingTodo: (state, action: PayloadAction<number>) => {
      state.pendingTodos = state.pendingTodos.filter(n => n !== action.payload);
    },
    setTempTodo: (state, action: PayloadAction<Todo | null>) => {
      state.tempTodo = action.payload;
    },
  },
});

export const { addPendingTodo, removePendingTodo, setTempTodo } =
  tepmSlice.actions;
export default tepmSlice.reducer;
