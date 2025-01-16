import { Todo } from '../Todo/Todo';
import type { Todo as TodoType } from '../../types';
import { useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';

interface Props {
  todos: TodoType[];
  setCompleted: (id: string, completed: boolean) => void;
  setTitle: (params: { id: string; title: string; category: string }) => void;
  removeTodo: (id: string) => void;
}

export const Todos: React.FC<Props> = ({
  todos,
  setCompleted,
  setTitle,
  removeTodo,
}) => {
  const [isEditing, setIsEditing] = useState('');
  const [parent] = useAutoAnimate<HTMLUListElement>();

  return (
    <ul className="todo-list" ref={parent}>
      {todos?.map((todo) => (
        <li
          key={todo.id}
          onDoubleClick={() => setIsEditing(todo.id)}
          className={`todo-item ${
            todo.completed ? 'completed' : ''
          } ${isEditing === todo.id ? 'editing' : ''}`}
        >
          <Todo
            id={todo.id}
            title={todo.title}
            category={todo.category}
            completed={todo.completed}
            setCompleted={setCompleted}
            setTitle={setTitle}
            removeTodo={removeTodo}
            isEditing={isEditing}
            setIsEditing={setIsEditing}
          />
        </li>
      ))}
    </ul>
  );
};
