import { useState } from 'react';
import {
  FaCoffee,
  FaBriefcase,
  FaShoppingCart,
  FaCar,
  FaHeart,
  FaTree,
  FaUtensils,
  FaPlusCircle,
} from 'react-icons/fa';
import { useAutoAnimate } from '@formkit/auto-animate/react';
import './CreateTodo.css';

interface Props {
  saveTodo: (title: string, category: string) => void;
}

export const CreateTodo: React.FC<Props> = ({ saveTodo }) => {
  const [inputValue, setInputValue] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [isCategoryMenuOpen, setIsCategoryMenuOpen] = useState(false);
  const [parent] = useAutoAnimate<HTMLDivElement>();

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter' && inputValue.trim() !== '') {
      if (!selectedCategory) {
        alert('Por favor, selecciona una categoría antes de guardar.');
        return;
      }
      saveTodo(inputValue.trim(), selectedCategory);
      setInputValue('');
      setSelectedCategory(''); 
    }
  };

  const categories = [
    { icon: <FaCoffee />, value: 'Relax' },
    { icon: <FaBriefcase />, value: 'Work' },
    { icon: <FaShoppingCart />, value: 'Shopping' },
    { icon: <FaCar />, value: 'Travel' },
    { icon: <FaHeart />, value: 'Health' },
    { icon: <FaTree />, value: 'Nature' },
    { icon: <FaUtensils />, value: 'Food' },
  ];

  return (
    <div className="create-todo-container">
      <div className="input-wrapper" ref={parent}>
        <button
          className="category-button"
          onClick={() => setIsCategoryMenuOpen(!isCategoryMenuOpen)}
          title="Seleccionar categoría"
          aria-haspopup="true"
          aria-expanded={isCategoryMenuOpen}
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
                className={`category-option ${selectedCategory === category.value ? 'selected' : ''}`}
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
