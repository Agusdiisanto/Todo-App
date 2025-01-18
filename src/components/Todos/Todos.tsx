import { Todo } from '../Todo/Todo';
import type { Todo as TodoType } from '../../types';
import React, { useState } from 'react';
import { AiOutlineUp, AiOutlineDown, AiOutlineInbox } from 'react-icons/ai';
import { motion, AnimatePresence } from 'framer-motion';
import { translations } from '../../translation';
import { useLanguage } from '../../hooks/lenguagueContext';
import './Todos.css';

interface Props {
  todos: TodoType[];
  setCompleted: (id: string, completed: boolean) => void;
  setTitle: (params: { id: string; title: string; category: string }) => void;
  removeTodo: (id: string) => void;
}

export const Todos: React.FC<Props> = ({ todos, setCompleted, setTitle, removeTodo }) => {
  const [isEditing, setIsEditing] = useState('');
  const categories = Array.from(new Set(todos.map((t) => t.category)));
  const { language } = useLanguage();
  const [openCategories, setOpenCategories] = useState(() => {
    const initial: Record<string, boolean> = {};
    categories.forEach((cat) => {
      initial[cat] = true;
    });
    return initial;
  });

  const categoryTranslations = translations[language].createTodo.categories;

  const containerVariants = {
    open: {
      height: 'auto',
      opacity: 1,
      transition: {
        duration: 0.4,
        ease: 'easeInOut',
      },
    },
    closed: {
      height: 0,
      opacity: 0,
      transition: {
        duration: 0.3,
        ease: 'easeInOut',
      },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 80,
        damping: 15,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const toggleCategory = (cat: string): void => {
    setOpenCategories((prev) => ({
      ...prev,
      [cat]: !prev[cat],
    }));
  };

  const handleDragStart = (e: React.DragEvent<HTMLLIElement>, todoId: string): void => {
    e.dataTransfer.setData('text/plain', todoId);
    e.currentTarget.classList.add('dragging');
  };

  const handleDragEnd = (e: React.DragEvent<HTMLLIElement>): void => {
    e.currentTarget.classList.remove('dragging');
  };

  const handleDragOver = (e: React.DragEvent<HTMLUListElement>): void => {
    e.preventDefault();
    e.currentTarget.classList.add('drop-target');
  };

  const handleDragLeave = (e: React.DragEvent<HTMLUListElement>): void => {
    e.currentTarget.classList.remove('drop-target');
  };

  const handleDrop = (e: React.DragEvent<HTMLUListElement>, newCategory: string): void => {
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
      {todos.length === 0 && (
        <div className="empty-state">
          <AiOutlineInbox className="empty-icon" />
          <p className="empty-text">{translations[language].todos.noTasks}</p>
        </div>
      )}

      {categories.map((cat) => {
        const tasks = todos.filter((t) => t.category === cat);
        const translatedCategory = categoryTranslations[cat as keyof typeof categoryTranslations] || cat;
        return (
          <div key={cat} className="category-section">
            <div className="category-header" onClick={() => toggleCategory(cat)}>
              <h2 className="category-title">
                {translatedCategory} <span className="task-count">({tasks.length})</span>
              </h2> 
              <button className="toggle-button">
                {openCategories[cat] ? <AiOutlineUp /> : <AiOutlineDown />}
              </button>
            </div>
            <AnimatePresence initial={false}>
              {openCategories[cat] && (
                <motion.ul
                  key={cat}
                  className="todo-list"
                  style={{ overflow: 'hidden' }}
                  variants={containerVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={(e: React.DragEvent<HTMLUListElement>) => handleDrop(e, cat)}
                  >
                  <AnimatePresence>
                    {tasks.length === 0 ? (
                      <motion.div
                        key="empty-state"
                        className="empty-state"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <AiOutlineInbox className="empty-icon" />
                        <p className="empty-text">{translations[language].todos.noTasks}</p>
                        </motion.div>
                    ) : (
                      tasks.map((todo) => (
                        <motion.li
                          key={todo.id}
                          className={`todo-item ${
                            todo.completed ? 'completed' : ''
                          } ${isEditing === todo.id ? 'editing' : ''}`}
                          draggable
                          onDragStart={(e: React.DragEvent<HTMLLIElement>) => handleDragStart(e, todo.id)}                          onDragEnd={handleDragEnd}
                          onDoubleClick={() => setIsEditing(todo.id)}
                          variants={itemVariants}
                          initial="hidden"
                          animate="visible"
                          exit="exit"
                          layout
                          whileHover={{
                            scale: 1.02,
                            boxShadow: '0 6px 15px rgba(0, 0, 0, 0.15)',
                          }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Todo
                            id={todo.id}
                            title={todo.title}
                            category={todo.category}
                            completed={todo.completed}
                            setCompleted={setCompleted}
                            setTitle={({ id, title, category }) =>
                              setTitle({ id, title, category })
                            }
                            removeTodo={removeTodo}
                            isEditing={isEditing}
                            setIsEditing={setIsEditing}
                          />
                        </motion.li>
                      ))
                    )}
                  </AnimatePresence>
                </motion.ul>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};
