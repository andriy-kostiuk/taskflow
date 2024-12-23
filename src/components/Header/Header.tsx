import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { createTodo, updateTodo } from '../../api/todos';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addTodo, setError, setTodo } from '../../store/slices/todos.slice';
import {
  addPendingTodo,
  removePendingTodo,
  setTempTodo,
} from '../../store/slices/temp.slice';

export const Header: React.FC = () => {
  const [newTitle, setNewTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { todos } = useAppSelector(state => state.todos);
  const { user } = useAppSelector(state => state.login);

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setTimeout(() => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    }, 0);
  }, [todos]);

  const isAllCompleted =
    todos.filter(todo => todo.completed).length === todos.length;

  const handlerFormSubmit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    if (!newTitle.trim()) {
      dispatch(setError('Title should not be empty'));

      return;
    }

    if (!user) {
      dispatch(setError('You need to log in'));

      return;
    }

    const newTodo = {
      title: newTitle.trim(),
      completed: false,
      userId: user.id,
    };

    setIsSubmitting(true);

    dispatch(setTempTodo({ ...newTodo, id: 0 }));

    createTodo(newTodo)
      .then(todoFromServer => {
        dispatch(addTodo(todoFromServer));
        setNewTitle('');
      })
      .catch(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 1);

        dispatch(setError('Unable to add a todo'));
      })
      .finally(() => {
        dispatch(setTempTodo(null));
        setIsSubmitting(false);
      });
  };

  const handlerSetAllStatus = () => {
    todos.forEach(({ id, completed }) => {
      if (!completed || isAllCompleted) {
        dispatch(addPendingTodo(id));
        updateTodo(id, { completed: !isAllCompleted })
          .then(() => {
            dispatch(setTodo({ id, completed: !isAllCompleted }));
          })
          .catch(() => dispatch(setError('Unable to update a todo')))
          .finally(() => dispatch(removePendingTodo(id)));
      }
    });
  };

  return (
    <header className="todoapp__header">
      {!!todos.length && (
        <button
          type="button"
          className={cn('todoapp__toggle-all', { active: isAllCompleted })}
          data-cy="ToggleAllButton"
          onClick={handlerSetAllStatus}
        />
      )}

      <form onSubmit={handlerFormSubmit}>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          value={newTitle}
          onChange={evt => setNewTitle(evt.target.value)}
          ref={inputRef}
          disabled={isSubmitting}
        />
      </form>
    </header>
  );
};
