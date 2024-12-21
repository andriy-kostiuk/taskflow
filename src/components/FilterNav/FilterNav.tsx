import { useCallback, useEffect } from 'react';
import cn from 'classnames';

import { Filter } from '../../types/Filter';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { setFilter } from '../../store/slices/todos.slice';

export const FilterNav = () => {
  const { filter } = useAppSelector(state => state.todos);
  const dispatch = useAppDispatch();

  const filters = Object.values(Filter);

  const isValidFilter = useCallback(
    (value: string): value is Filter => {
      return filters.includes(value as Filter);
    },
    [filters],
  );

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const currentFilter = urlParams.get('filter')?.toLowerCase() || Filter.ALL;

    if (isValidFilter(currentFilter) && currentFilter !== filter) {
      dispatch(setFilter(currentFilter));
    }
  }, [dispatch, filter, isValidFilter]);

  const handleFilterClick = (status: Filter) => {
    if (filter === status) {
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);

    if (status !== Filter.ALL) {
      urlParams.set('filter', status);
    } else {
      urlParams.delete('filter');
    }

    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;

    window.history.pushState(null, '', newUrl);
    dispatch(setFilter(status));
  };

  return (
    <nav className="filter" data-cy="Filter">
      {filters.map(status => {
        return (
          <button
            key={status}
            className={cn('filter__link', { selected: filter === status })}
            data-cy={`FilterLink${status}`}
            onClick={() => {
              handleFilterClick(status);
            }}
          >
            {status[0].toUpperCase() + status.slice(1)}
          </button>
        );
      })}
    </nav>
  );
};
