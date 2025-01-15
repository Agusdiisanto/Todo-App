import React, { useState } from "react";
import { useAutoAnimate } from "@formkit/auto-animate/react";
import { useTodosContext } from "../Hooks/TodoContex";
import { TodoItem } from "./TodoItem";

export const Todos: React.FC = () => {
  const { state, dispatch } = useTodosContext();
    const [isEditing, setIsEditing] = useState<string>("");
  const [parent] = useAutoAnimate();

  const filteredTodos = state.todos.filter((todo) => {
    if (state.filterSelected === "active") return !todo.completed;
    if (state.filterSelected === "completed") return todo.completed;
    return true; 
  });

  const handleStartEditing = (id: string) => {
    setIsEditing(id);
  };

  const handleCancelEditing = () => {
    setIsEditing("");
  };

  const handleToggleCompleted = (id: string, completed: boolean) => {
    dispatch({ type: "COMPLETED", payload: { id, completed } });
  };

  const handleRemove = (id: string) => {
    dispatch({ type: "REMOVE", payload: { id } });
  };

  const handleUpdateTitle = ({ id, title }: { id: string; title: string }) => {
    dispatch({ type: "UPDATE_TITLE", payload: { id, title } });
    setIsEditing("");
  };

  return (
    <ul className="todo-list" ref={parent}>
      {filteredTodos.map((todo) => {
        const isCurrentlyEditing = isEditing === todo.id;

        return (
          <li
            key={todo.id}
            className={`
              ${todo.completed ? "completed" : ""}
              ${isCurrentlyEditing ? "editing" : ""}
            `}
          >
            <TodoItem
              {...todo}
              isEditing={isCurrentlyEditing}
              onStartEditing={handleStartEditing}
              onCancelEditing={handleCancelEditing}
              onToggleCompleted={handleToggleCompleted}
              onRemove={handleRemove}
              onUpdateTitle={handleUpdateTitle}
            />
          </li>
        );
      })}
    </ul>
  );
};
