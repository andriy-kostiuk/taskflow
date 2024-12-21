import React, { useEffect, useRef, useState } from 'react';
import cn from 'classnames';

import { Todo } from '../../types/Todo';
import { deleteTodo, updateTodo } from '../../api/todos';
import { useAppDispatch } from '../../store/hooks';
import { removeTodo, setError, setTodo } from '../../store/slices/todos.slice';

interface Props {
  todo: Todo;
  isPending: boolean;
}

export const TodoItem: React.FC<Props> = ({ todo, isPending }) => {
  const { completed, title, id } = todo;

  const [value, setValue] = useState(title);
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false || isPending);

  const dispatch = useAppDispatch();

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setIsLoading(isPending);
  }, [isPending]);

  useEffect(() => {
    if (inputRef.current && isEdit) {
      inputRef.current.focus();
    }
  }, [isEdit]);

  const handlerSetStatus = () => {
    setIsLoading(true);
    updateTodo(id, { completed: !completed })
      .then(() => {
        dispatch(setTodo({ id, completed: !completed }));
      })
      .catch(() => {
        dispatch(setError('Unable to update a todo'));
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerOnKeyUpEsc = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.key === 'Escape') {
      setValue(todo.title);
      setIsEdit(false);
    }
  };

  const handlerDeleteTodo = () => {
    setIsLoading(true);
    deleteTodo(id)
      .then(res => {
        if (res === 1) {
          dispatch(removeTodo(id));
        }
      })
      .catch(() => {
        dispatch(setError('Unable to delete a todo'));
        inputRef.current?.focus();
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlerEndEdit = () => {
    const newValue = value.trim();

    if (!newValue) {
      handlerDeleteTodo();

      return;
    }

    if (newValue !== title) {
      setIsEdit(false);

      setIsLoading(true);

      updateTodo(id, { title: newValue })
        .then(() => {
          dispatch(setTodo({ id, title: newValue }));
        })
        .catch(() => {
          setIsEdit(true);
          dispatch(setError('Unable to update a todo'));
          inputRef.current?.focus();
        })
        .finally(() => {
          setIsLoading(false);
        });

      return;
    }

    setIsEdit(false);
  };

  const handlerSubmitEdit = (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    handlerEndEdit();
  };

  return (
    <div data-cy="Todo" className={cn('todo', { completed: completed })}>
      <label className="todo__status-label" aria-label="todo status">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          checked={completed}
          onChange={handlerSetStatus}
        />
      </label>

      {isEdit ? (
        <form onSubmit={handlerSubmitEdit}>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            ref={inputRef}
            value={value}
            onChange={evt => setValue(evt.target.value)}
            onBlur={handlerEndEdit}
            onKeyUp={handlerOnKeyUpEsc}
          />
        </form>
      ) : (
        <>
          <span
            data-cy="TodoTitle"
            className="todo__title"
            onDoubleClick={() => setIsEdit(true)}
          >
            {title}
          </span>

          <button
            type="button"
            className="todo__remove"
            data-cy="TodoDelete"
            onClick={handlerDeleteTodo}
          >
            ×
          </button>
        </>
      )}

      <div
        data-cy="TodoLoader"
        className={cn('modal overlay', {
          'is-active': isLoading,
        })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};
