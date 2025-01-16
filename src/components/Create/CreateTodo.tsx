import { useState } from 'react';
import { FaCoffee, FaBriefcase, FaShoppingCart, FaPlusCircle } from 'react-icons/fa';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import './CreateTodo.css';

interface Props {
  saveTodo: (title: string, category: string) => void;
}

export const CreateTodo: React.FC<Props> = ({ saveTodo }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      saveTodo(inputValue.trim(), selectedCategory || 'Uncategorized');
      setInputValue('');
      setSelectedCategory('');
    }
  };

  const categories = [
    { icon: <FaCoffee />, value: 'Relax' },
    { icon: <FaBriefcase />, value: 'Work' },
    { icon: <FaShoppingCart />, value: 'Shopping' },
  ];

  return (
    <div className="create-todo-container">
      <div className="input-wrapper" ref={parent}>
        <button
          className="category-button"
          onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
          title="Seleccionar categoría"
        >
          {selectedCategory
            ? categories.find((c) => c.value === selectedCategory)?.icon
            : <FaPlusCircle />}
        </button>

        {isCategoryMenuOpen && (
          <div className="category-menu">
            {categories.map((category) => (
              <div
                key={category.value}
                className="category-option"
                onClick={() => {
                  setSelectedCategory(category.value);
                  setIsCategoryMenuOpen(false);
                }}
              >
                {category.icon} <span>{category.value}</span>
              </div>
            ))}
          </div>
        )}

        <input
          className="new-todo"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="¿Qué quieres hacer?"
          autoFocus
        />
      </div>
    </div>
  );
};
