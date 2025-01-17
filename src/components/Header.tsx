import { CreateTodo } from './Create/CreateTodo';
import './Header.css';

interface Props {
  saveTodo: (title: string, category: string) => void;
}

export const Header: React.FC<Props> = ({ saveTodo }) => {
  return (
    <header className="header">
      <h1>
        Plan Your Day
      </h1>
      <CreateTodo saveTodo={saveTodo} />
    </header>
  );
};
