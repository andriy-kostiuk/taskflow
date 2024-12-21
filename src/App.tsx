import React, { useEffect } from 'react';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchTodos } from './store/slices/todos.slice';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, error } = useAppSelector(state => state.todos);

  useEffect(() => {
    dispatch(fetchTodos());
  }, [dispatch]);

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header />

        <TodoList />

        {!!todos.length && <Footer />}
      </div>

      <ErrorNotification errorMessage={error} />
    </div>
  );
};
