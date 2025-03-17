
import React, { createContext, useContext, useState, useEffect } from "react";
import { Todo } from "@/lib/types";
import { toast } from "@/hooks/use-toast";

interface TodoContextType {
  todos: Todo[];
  addTodo: (text: string) => void;
  toggleTodo: (id: string) => void;
  deleteTodo: (id: string) => void;
  clearCompletedTodos: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const TodoProvider = ({ children }: { children: React.ReactNode }) => {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const savedTodos = localStorage.getItem("todos");
    if (savedTodos) {
      try {
        return JSON.parse(savedTodos).map((todo: any) => ({
          ...todo,
          createdAt: new Date(todo.createdAt)
        }));
      } catch (e) {
        console.error("Failed to parse todos from localStorage", e);
        return [];
      }
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  const addTodo = (text: string) => {
    if (!text.trim()) return;
    
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      text,
      completed: false,
      createdAt: new Date(),
    };
    
    setTodos(prev => [newTodo, ...prev]);
    toast({
      title: "Todo added",
      description: "Your new task has been added!",
    });
  };

  const toggleTodo = (id: string) => {
    setTodos(prev => 
      prev.map(todo => 
        todo.id === id 
          ? { ...todo, completed: !todo.completed } 
          : todo
      )
    );
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
    toast({
      title: "Todo deleted",
      description: "Your task has been removed.",
      variant: "destructive",
    });
  };

  const clearCompletedTodos = () => {
    const completedCount = todos.filter(todo => todo.completed).length;
    if (completedCount === 0) return;
    
    setTodos(prev => prev.filter(todo => !todo.completed));
    toast({
      title: "Completed todos cleared",
      description: `${completedCount} completed tasks have been removed.`,
    });
  };

  const value = {
    todos,
    addTodo,
    toggleTodo,
    deleteTodo,
    clearCompletedTodos,
  };

  return <TodoContext.Provider value={value}>{children}</TodoContext.Provider>;
};

export const useTodos = () => {
  const context = useContext(TodoContext);
  if (context === undefined) {
    throw new Error("useTodos must be used within a TodoProvider");
  }
  return context;
};
