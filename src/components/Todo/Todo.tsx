import { useEffect, useRef, useState } from 'react';

interface Props {
  id: string;
  title: string;
  category: string;
  completed: boolean;
  setCompleted: (id: string, completed: boolean) => void;
  setTitle: (params: { id: string; title: string; category: string }) => void;
  isEditing: string;
  setIsEditing: (id: string) => void;
  removeTodo: (id: string) => void;
}

export const Todo: React.FC<Props> = ({
  id,
  title,
  category,
  completed,
  setCompleted,
  setTitle,
  removeTodo,
  isEditing,
  setIsEditing,
}) => {
  const [editedTitle, setEditedTitle] = useState(title);
  const [editedCategory, setEditedCategory] = useState(category);
  const inputEditTitle = useRef<HTMLInputElement>(null);

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      const trimmedTitle = editedTitle.trim();
      const trimmedCategory = editedCategory.trim();

      if (trimmedTitle !== title || trimmedCategory !== category) {
        setTitle({ id, title: trimmedTitle, category: trimmedCategory });
      }

      if (trimmedTitle === '') {
        removeTodo(id);
      }

      setIsEditing('');
    }

    if (e.key === 'Escape') {
      setEditedTitle(title);
      setEditedCategory(category);
      setIsEditing('');
    }
  };

  useEffect(() => {
    if (isEditing === id) {
      inputEditTitle.current?.focus();
    }
  }, [isEditing, id]);

  return (
    <>
      <div className="view">
        <input
          className="toggle"
          type="checkbox"
          checked={completed}
          onChange={(e) => setCompleted(id, e.target.checked)}
        />
        <label onDoubleClick={() => setIsEditing(id)}>
          {title} 
        </label>
        <button className="destroy" onClick={() => removeTodo(id)}></button>
      </div>

      {isEditing === id && (
        <div className="edit-container">
          <input
            className="edit-title"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => setIsEditing('')}
            ref={inputEditTitle}
            placeholder="Edit Title"
          />
          <input
            className="edit-category"
            value={editedCategory}
            onChange={(e) => setEditedCategory(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Edit Category"
          />
        </div>
      )}
    </>
  );
};
