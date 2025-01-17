import { useEffect, useRef, useState } from 'react'

interface Props {
  id: string
  title: string
  completed: boolean
  category: string
  setCompleted: (id: string, completed: boolean) => void
  setTitle: (params: { id: string; title: string; category: string }) => void
  isEditing: string
  setIsEditing: (completed: string) => void
  removeTodo: (id: string) => void
}

export const Todo: React.FC<Props> = ({
  id,
  title,
  completed,
  category,
  setCompleted,
  setTitle,
  removeTodo,
  isEditing,
  setIsEditing
}) => {
  const [editedTitle, setEditedTitle] = useState(title)
  const inputEditTitle = useRef<HTMLInputElement>(null)

  const handleKeyDown: React.KeyboardEventHandler<HTMLInputElement> = (e) => {
    if (e.key === 'Enter') {
      const newTitle = editedTitle.trim()
      if (newTitle !== '') {
        setTitle({ id, title: newTitle, category })
      } else {
        removeTodo(id)
      }
      setIsEditing('')
    }
    if (e.key === 'Escape') {
      setEditedTitle(title)
      setIsEditing('')
    }
  }

  useEffect(() => {
    if (isEditing === id) {
      inputEditTitle.current?.focus()
    }
  }, [isEditing, id])

  return (
    <>
      <div className='view'>
        <input
          className='toggle'
          checked={completed}
          type='checkbox'
          onChange={(e) => setCompleted(id, e.target.checked)}
        />
        <label>{title}</label>
        <button className='destroy' onClick={() => removeTodo(id)}></button>
      </div>
      {isEditing === id && (
        <input
          className='edit'
          value={editedTitle}
          onChange={(e) => setEditedTitle(e.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={() => setIsEditing('')}
          ref={inputEditTitle}
        />
      )}
    </>
  )
}
