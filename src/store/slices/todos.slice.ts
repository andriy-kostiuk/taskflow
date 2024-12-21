import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { Todo } from '../../types/Todo';
import { getTodos } from '../../api/todos';
import { Filter } from '../../types/Filter';

export type TodosState = {
  todos: Todo[];
  error: string;
  filter: Filter;
};

type SetTodoAction = Partial<Omit<Todo, 'id'>> & { id: number };

const initialState: TodosState = {
  todos: [],
  error: '',
  filter: Filter.ALL,
};

export const fetchTodos = createAsyncThunk('todos/fetchTodos', async () => {
  const response = await getTodos();

  return response;
});

const todosSlice = createSlice({
  name: 'todos',
  initialState,
  reducers: {
    addTodo: (state, action: PayloadAction<Todo>) => {
      state.todos.push(action.payload);
    },
    removeTodo: (state, action: PayloadAction<number>) => {
      state.todos = state.todos.filter(todo => todo.id !== action.payload);
    },
    setTodo: (state, action: PayloadAction<SetTodoAction>) => {
      const currentTodo = state.todos.find(
        todo => todo.id === action.payload.id,
      );

      if (currentTodo) {
        Object.assign(currentTodo, action.payload);
      }
    },
    setFilter(state, action: PayloadAction<Filter>) {
      state.filter = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
    },
  },

  extraReducers: builder => {
    builder.addCase(
      fetchTodos.fulfilled,
      (state, action: PayloadAction<Todo[]>) => {
        state.todos = action.payload;
      },
    );
    builder.addCase(fetchTodos.rejected, state => {
      state.error = 'Unable to load todos';
    });
  },
});

export const { addTodo, removeTodo, setError, setFilter, setTodo } =
  todosSlice.actions;
export default todosSlice.reducer;
