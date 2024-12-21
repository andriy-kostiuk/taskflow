import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './slices/todos.slice';
import tempReducer from './slices/temp.slice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    temp: tempReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
