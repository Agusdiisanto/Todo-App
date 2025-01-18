import { CreateTodo } from './Create/CreateTodo';
import { useLanguage } from '../hooks/lenguagueContext';
import { translations } from '../translation';

interface Props {
  saveTodo: (title: string, category: string) => void;
}

export const Header: React.FC<Props> = ({ saveTodo }) => {
  const { language } = useLanguage();

  const headerStyle: React.CSSProperties = {
    fontSize: '4rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    whiteSpace: 'nowrap',
    letterSpacing: '0.1rem',
  };

  return (
    <header>
      <h1 style={headerStyle}>
        {translations[language].header.title}
      </h1>
      <CreateTodo saveTodo={saveTodo} />
    </header>
  );
};
