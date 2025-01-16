import { Todo } from '../Todo/Todo';
import type { Todo as TodoType } from '../../types';
import { useState } from 'react';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import './Todos.css';

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

  const groupedTodos = todos.reduce((groups, todo) => {
    const { category } = todo;
    console.log(todo)
    const validCategory = category || 'Uncategorized'; 
    if (!groups[validCategory]) {
      groups[validCategory] = [];
    }
    groups[validCategory].push(todo);
    return groups;
  }, {} as Record<string, TodoType[]>);

  return (
    <div className="todos-container">
      {Object.entries(groupedTodos).map(([category, categoryTodos]) => (
        <div key={category} className="category-section">
          <h2 className="category-title">{category}</h2>
          <ul className="todo-list" ref={parent}>
            {categoryTodos.map((todo) => (
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
        </div>
      ))}
    </div>
  );
};
