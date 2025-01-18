import { type FilterValue } from '../types.js';
import { translations } from '../translation';
import { useLanguage } from '../hooks/lenguagueContext.js';

interface Props {
  handleFilterChange: (filter: FilterValue) => void;
  filterSelected: FilterValue;
}

export const Filters: React.FC<Props> = ({ filterSelected, handleFilterChange }) => {
  const { language } = useLanguage();

  const FILTERS_BUTTONS = {
    all: { 
      literal: translations[language].todoFilters.all, 
      href: `/?filter=all` 
    },
    active: { 
      literal: translations[language].todoFilters.active, 
      href: `/?filter=active` 
    },
    completed: { 
      literal: translations[language].todoFilters.completed, 
      href: `/?filter=completed` 
    },
  } as const;

  const handleClick = (filter: FilterValue) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    handleFilterChange(filter);
  };

  return (
    <ul className="filters">
      {Object.entries(FILTERS_BUTTONS).map(([key, { href, literal }]) => {
        const isSelected = key === filterSelected;
        const className = isSelected ? 'selected' : '';
        return (
          <li key={key}>
            <a
              href={href}
              className={className}
              onClick={handleClick(key as FilterValue)}
            >
              {literal}
            </a>
          </li>
        );
      })}
    </ul>
  );
};
