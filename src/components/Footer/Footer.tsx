import { type FilterValue } from '../../types';
import { useLanguage } from '../../hooks/lenguagueContext';
import { Filters } from '../Filters/Filters';
import { translations } from '../../translation';
import './Footer.css';

interface Props {
  handleFilterChange: (filter: FilterValue) => void;
  activeCount: number;
  completedCount: number;
  onClearCompleted: () => void;
  filterSelected: FilterValue;
}

export const Footer: React.FC<Props> = ({
  activeCount,
  completedCount,
  onClearCompleted,
  filterSelected,
  handleFilterChange,
}) => {
  const { language } = useLanguage();
  const t = translations[language].footer;

  const singleActiveCount = activeCount === 1;
  const taskWord = singleActiveCount ? t.task : t.tasks;
  const pluralSuffix = singleActiveCount ? '' : 's';
  const pendingText = `${activeCount} ${taskWord} pendiente${pluralSuffix}`;

  return (
    <footer className="footer">
      <span className="todo-count">
        {pendingText}
      </span>
      <Filters filterSelected={filterSelected} handleFilterChange={handleFilterChange} />
      {completedCount > 0 && (
        <button className="clear-completed" onClick={onClearCompleted}>
          {t.clearCompleted}
        </button>
      )}
    </footer>
  );
};


