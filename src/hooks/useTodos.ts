import { useEffect, useReducer } from 'react';
import { TODO_FILTERS } from '../consts';
import { fetchTodos, updateTodos } from '../services/todos';
import { type TodoList, type FilterValue } from '../types';

const initialState = {
  sync: false,
  todos: [],
  filterSelected: (() => {
    const params = new URLSearchParams(window.location.search);
    const filter = params.get('filter') as FilterValue | null;
    if (filter === null) return TODO_FILTERS.ALL;
    return Object.values(TODO_FILTERS).includes(filter) ? filter : TODO_FILTERS.ALL;
  })(),
};

type Action =
  | { type: 'INIT_TODOS'; payload: { todos: TodoList } }
  | { type: 'CLEAR_COMPLETED' }
  | { type: 'COMPLETED'; payload: { id: string; completed: boolean } }
  | { type: 'FILTER_CHANGE'; payload: { filter: FilterValue } }
  | { type: 'REMOVE'; payload: { id: string } }
  | { type: 'SAVE'; payload: { title: string; category: string } }
  | { type: 'UPDATE_TITLE'; payload: { id: string; title: string; category: string } };

interface State {
  sync: boolean;
  todos: TodoList;
  filterSelected: FilterValue;
}

const reducer = (state: State, action: Action): State => {
  if (action.type === 'INIT_TODOS') {
    const { todos } = action.payload;
    return {
      ...state,
      sync: false,
      todos,
    };
  }

  if (action.type === 'CLEAR_COMPLETED') {
    return {
      ...state,
      sync: true,
      todos: state.todos.filter((todo) => !todo.completed),
    };
  }

  if (action.type === 'COMPLETED') {
    const { id, completed } = action.payload;
    return {
      ...state,
      sync: true,
      todos: state.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            completed,
          };
        }
        return todo;
      }),
    };
  }

  if (action.type === 'FILTER_CHANGE') {
    const { filter } = action.payload;
    return {
      ...state,
      sync: true,
      filterSelected: filter,
    };
  }

  if (action.type === 'REMOVE') {
    const { id } = action.payload;
    return {
      ...state,
      sync: true,
      todos: state.todos.filter((todo) => todo.id !== id),
    };
  }

  if (action.type === 'SAVE') {
    const { title, category } = action.payload;
    const newTodo = {
      id: crypto.randomUUID(),
      title,
      category: category || 'Uncategorized', 
      completed: false,
    };

    return {
      ...state,
      sync: true,
      todos: [...state.todos, newTodo],
    };
  }

  if (action.type === 'UPDATE_TITLE') {
    const { id, title, category } = action.payload
    return {
      ...state,
      sync: true,
      todos: state.todos.map((todo) => {
        if (todo.id === id) {
          return {
            ...todo,
            title,
            category 
          }
        }
        return todo
      })
    }
  }

  return state;
};

export const useTodos = (): {
  activeCount: number;
  completedCount: number;
  todos: TodoList;
  filterSelected: FilterValue;
  handleClearCompleted: () => void;
  handleCompleted: (id: string, completed: boolean) => void;
  handleFilterChange: (filter: FilterValue) => void;
  handleRemove: (id: string) => void;
  handleSave: (title: string, category: string) => void;
  handleUpdateTitle: (params: { id: string; title: string; category: string }) => void;
} => {
  const [{ sync, todos, filterSelected }, dispatch] = useReducer(reducer, initialState);

  const handleCompleted = (id: string, completed: boolean): void => {
    dispatch({ type: 'COMPLETED', payload: { id, completed } });
  };

  const handleRemove = (id: string): void => {
    dispatch({ type: 'REMOVE', payload: { id } });
  };

  const handleUpdateTitle = ({ id, title, category }: { id: string; title: string; category: string }) => {
    dispatch({ type: 'UPDATE_TITLE', payload: { id, title, category } })
  }

  const handleSave = (title: string, category: string): void => {
    dispatch({ type: 'SAVE', payload: { title, category } });
  };

  const handleClearCompleted = (): void => {
    dispatch({ type: 'CLEAR_COMPLETED' });
  };

  const handleFilterChange = (filter: FilterValue): void => {
    dispatch({ type: 'FILTER_CHANGE', payload: { filter } });

    const params = new URLSearchParams(window.location.search);
    params.set('filter', filter);
    window.history.pushState({}, '', `${window.location.pathname}?${params.toString()}`);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filterSelected === TODO_FILTERS.ACTIVE) {
      return !todo.completed;
    }

    if (filterSelected === TODO_FILTERS.COMPLETED) {
      return todo.completed;
    }

    return true;
  });

  const completedCount = todos.filter((todo) => todo.completed).length;
  const activeCount = todos.length - completedCount;

  useEffect(() => {
    fetchTodos()
      .then((todos) => {
        dispatch({ type: 'INIT_TODOS', payload: { todos } });
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (sync) {
      updateTodos({ todos }).catch((err) => {
        console.error(err);
      });
    }
  }, [todos, sync]);

  return {
    activeCount,
    completedCount,
    filterSelected,
    handleClearCompleted,
    handleCompleted,
    handleFilterChange,
    handleRemove,
    handleSave,
    handleUpdateTitle,
    todos: filteredTodos,
  };
};