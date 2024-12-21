import React from 'react';

import { deleteTodo } from '../../api/todos';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import {
  addPendingTodo,
  removePendingTodo,
} from '../../store/slices/temp.slice';
import { removeTodo, setError } from '../../store/slices/todos.slice';

import { FilterNav } from '../FilterNav';

export const Footer: React.FC = () => {
  const { todos } = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();

  const hasCompleted = todos.filter(todo => todo.completed).length;

  const countTodosLeft = todos.filter(t => !t.completed).length;

  const handlerClearCompleted = () => {
    todos.forEach(({ id, completed }) => {
      if (completed) {
        dispatch(addPendingTodo(id));

        deleteTodo(id)
          .then(res => {
            if (res === 1) {
              dispatch(removeTodo(id));
            }
          })
          .catch(() => dispatch(setError('Unable to delete a todo')))
          .finally(() => dispatch(removePendingTodo(id)));
      }
    });
  };

  return (
    <footer className="todoapp__footer" data-cy="Footer">
      <span className="todo-count" data-cy="TodosCounter">
        {countTodosLeft} items left
      </span>

      <FilterNav />

      <button
        type="button"
        className="todoapp__clear-completed"
        data-cy="ClearCompletedButton"
        onClick={handlerClearCompleted}
        disabled={!hasCompleted}
      >
        Clear completed
      </button>
    </footer>
  );
};
