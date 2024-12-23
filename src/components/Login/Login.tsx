import React, { useState } from 'react';
import cn from 'classnames';
import { getUser, createUser } from '../../api/user';
import { useAppDispatch } from '../../store/hooks';
import { setUser } from '../../store/slices/login.slice';

export const Login = () => {
  const [registered, setRegistered] = useState(true);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');

  const dispatch = useAppDispatch();

  const onFormSubmit = async (evt: React.FormEvent) => {
    evt.preventDefault();

    if (registered) {
      const [user] = await getUser(email);

      if (!user) {
        setRegistered(false);

        return;
      }

      dispatch(setUser(user));
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      const newUser = await createUser({ email, name });

      dispatch(setUser(newUser));
      localStorage.setItem('user', JSON.stringify(newUser));
    }
  };

  return (
    <form className={cn('box', 'mt-5')}>
      <h1 className={cn('title', 'is-3')}>
        {registered ? 'Log in to open todos' : 'You need to register'}
      </h1>
      <div className="field">
        <label className="label" htmlFor="user-email">
          Email
        </label>
        <div className={cn('control', 'has-icons-left')}>
          <input
            className="input"
            type="email"
            id="user-email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <span className={cn('icon', 'is-small', 'is-left')}>
            <i className={cn('fas', 'fa-envelope')}></i>
          </span>
        </div>
      </div>
      {!registered && (
        <div className="field">
          <label className="label" htmlFor="user-name">
            Your Name
          </label>
          <div className={cn('control', 'has-icons-left')}>
            <input
              className="input"
              type="text"
              id="user-name"
              placeholder="Enter your name"
              required
              value={name}
              onChange={e => setName(e.target.value)}
            />
            <span className={cn('icon', 'is-small', 'is-left')}>
              <i className={cn('fas', 'fa-user')}></i>
            </span>
          </div>
        </div>
      )}
      <div className="field">
        <button
          className={cn('button', 'is-primary')}
          type="submit"
          onClick={onFormSubmit}
        >
          {registered ? 'Login' : 'Register'}
        </button>
      </div>
    </form>
  );
};
