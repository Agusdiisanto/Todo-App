import { type TodoList } from '../types'

const LOCAL_STORAGE_KEY = 'todos_app'

export const fetchTodos = async (): Promise<TodoList> => {
  const dataString = localStorage.getItem(LOCAL_STORAGE_KEY)
  if (!dataString) {
    return []
  }
  
  try {
    const todos = JSON.parse(dataString) as TodoList
    return todos
  } catch (error) {
    console.error('Error parsing todos from localStorage:', error)
    return []
  }
}

export const updateTodos = async ({ todos }: { todos: TodoList }): Promise<boolean> => {
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(todos))
    return true
  } catch (error) {
    console.error('Error saving todos to localStorage:', error)
    return false
  }
}
