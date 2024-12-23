import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './slices/todos.slice';
import tempReducer from './slices/temp.slice';
import loginReducer from './slices/login.slice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    temp: tempReducer,
    login: loginReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
