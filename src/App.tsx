import React, { useEffect } from 'react';
import { ErrorNotification } from './components/ErrorNotification';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { TodoList } from './components/TodoList';
import { useAppDispatch, useAppSelector } from './store/hooks';
import { fetchTodos } from './store/slices/todos.slice';
import { Login } from './components/Login';
import { setUser } from './store/slices/login.slice';

export const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const { todos, error } = useAppSelector(state => state.todos);
  const { user } = useAppSelector(state => state.login);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');

    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, [dispatch]);

  useEffect(() => {
    if (user) {
      dispatch(fetchTodos(user.id));
    }
  }, [dispatch, user]);

  if (!user) {
    return <Login />;
  }

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
