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

export const Todos: React.FC<Props> = ({ todos, setCompleted, setTitle, removeTodo }) => {
  const [isEditing, setIsEditing] = useState('');
  const [parent] = useAutoAnimate();
  const categories = Array.from(new Set(todos.map((t) => t.category)));
  const [openCategories, setOpenCategories] = useState(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat] = true;
    });
    return initial;
  });

  const toggleCategory = (cat: string) => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, todoId: string) => {
    e.dataTransfer.setData('text/plain', todoId);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>) => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    e.currentTarget.classList.add('drop-target');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLUListElement>) => {
    e.currentTarget.classList.remove('drop-target');
  };

  const handleDrop = (e: React.DragEvent<HTMLUListElement>, newCategory: string) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drop-target');
    const droppedId = e.dataTransfer.getData('text/plain');
    const dropped = todos.find((t) => t.id === droppedId);
    if (!dropped) return;
    if (dropped.category !== newCategory) {
      setTitle({ id: dropped.id, title: dropped.title, category: newCategory });
    }
  };

  return (
    <div className="todos-container">
      {categories.map((cat) => {
        const tasks = todos.filter((t) => t.category === cat);
        return (
          <div key={cat} className="category-section">
            <div className="category-header" onClick={() => toggleCategory(cat)}>
              <h2 className="category-title">
                {cat} <span className="task-count">({tasks.length})</span>
              </h2>
              <button className="toggle-button">
                {openCategories[cat] ? '▲' : '▼'}
              </button>
            </div>
            <ul
              className={`todo-list ${!openCategories[cat] ? 'hidden' : ''}`}
              ref={parent}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleDrop(e, cat)}
            >
              {tasks.map((todo) => (
                <li
                  key={todo.id}
                  className={`todo-item ${
                    todo.completed ? 'completed' : ''
                  } ${isEditing === todo.id ? 'editing' : ''}`}
                  draggable
                  onDragStart={(e) => handleDragStart(e, todo.id)}
                  onDragEnd={handleDragEnd}
                  onDoubleClick={() => setIsEditing(todo.id)}
                >
                  <Todo
                    id={todo.id}
                    title={todo.title}
                    category={todo.category}
                    completed={todo.completed}
                    setCompleted={setCompleted}
                    setTitle={({ id, title, category }) => {
                      setTitle({ id, title, category });
                    }}
                    removeTodo={removeTodo}
                    isEditing={isEditing}
                    setIsEditing={setIsEditing}
                  />
                </li>
              ))}
            </ul>
          </div>
        );
      })}
    </div>
  );
};
