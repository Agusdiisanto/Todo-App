import { CreateTodo } from './Create/CreateTodo'
import { Todo } from './Todo/Todo';

interface Props {
  saveTodo: (title: string) => void
}

export const Header: React.FC<Props> = ({ saveTodo }) => {
  return (
    <header className='header'>
      <h1>Todo List
      </h1>
      <CreateTodo saveTodo={saveTodo} />
    </header>
  )
}
