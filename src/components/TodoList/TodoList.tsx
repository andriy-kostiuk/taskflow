import React from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';

import { TodoItem } from '../TodoItem';
import { Filter } from '../../types/Filter';
import { useAppSelector } from '../../store/hooks';

export const TodoList: React.FC = () => {
  const { todos, filter } = useAppSelector(state => state.todos);
  const { tempTodo, pendingTodos } = useAppSelector(state => state.temp);

  const visibleTodos = todos.filter(todo => {
    switch (filter) {
      case Filter.COMPLETED:
        return todo.completed;
      case Filter.ACTIVE:
        return !todo.completed;
      default:
        return true;
    }
  });

  return (
    <section className="todoapp__main" data-cy="TodoList">
      <TransitionGroup>
        {visibleTodos.map(todo => {
          return (
            <CSSTransition key={todo.id} timeout={300} classNames="item">
              <TodoItem
                key={todo.id}
                todo={todo}
                isPending={pendingTodos.includes(todo.id)}
              />
            </CSSTransition>
          );
        })}
        {tempTodo && (
          <CSSTransition key={0} timeout={300} classNames="temp-item">
            <TodoItem todo={tempTodo} isPending={true} />
          </CSSTransition>
        )}
      </TransitionGroup>
    </section>
  );
};
