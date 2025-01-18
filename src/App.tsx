import { Footer } from './components/Footer/Footer';
import { Header } from './components/Header/Header';
import { Todos } from './components/Todos/Todos';
import { useTodos } from './hooks/useTodos';
import { LanguageProvider, useLanguage } from './hooks/lenguagueContext';
import { translations } from './translation';
import "./App.css"

const App: React.FC = () => {
  const {
    activeCount,
    completedCount,
    filterSelected,
    handleClearCompleted,
    handleCompleted,
    handleFilterChange,
    handleRemove,
    handleSave,
    handleUpdateTitle,
    todos: filteredTodos,
  } = useTodos();

  return (
    <LanguageProvider>
      <div className="todoapp">
        <LanguageToggle />
        <Header saveTodo={handleSave} />
        <Todos
          removeTodo={handleRemove}
          setCompleted={handleCompleted}
          setTitle={handleUpdateTitle}
          todos={filteredTodos}
        />
        <Footer
          handleFilterChange={handleFilterChange}
          completedCount={completedCount}
          activeCount={activeCount}
          filterSelected={filterSelected}
          onClearCompleted={handleClearCompleted}
        />
      </div>
    </LanguageProvider>
  );
};

const LanguageToggle: React.FC = () => {
  const { language, toggleLanguage } = useLanguage();
  
  return (
    <div className="language-toggle-container">
      <button className="language-toggle" onClick={toggleLanguage}>
        {translations[language].header.languageToggle}
      </button>
    </div>
  );
};

export default App;
