import { CreateTodo } from '../Create/CreateTodo';
import { useLanguage } from '../../hooks/lenguagueContext';
import { translations } from '../../translation';
import './Header.css';


interface Props {
  saveTodo: (title: string, category: string) => void;
}

export const Header: React.FC<Props> = ({ saveTodo }) => {
  const { language } = useLanguage();

  return (
    <header>
      <h1>
        {translations[language].header.title}
      </h1>
      <CreateTodo saveTodo={saveTodo} />
    </header>
  );
};
