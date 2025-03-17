
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/components/TodoContext";

export function TodoStats() {
  const { todos, clearCompletedTodos } = useTodos();
  
  const totalTodos = todos.length;
  const completedTodos = todos.filter(todo => todo.completed).length;
  const incompleteTodos = totalTodos - completedTodos;

  if (totalTodos === 0) return null;

  return (
    <div className="flex items-center justify-between px-1 text-sm text-muted-foreground animate-in fade-in duration-300">
      <div>
        <span>{incompleteTodos} remaining</span>
        {completedTodos > 0 && <span> · {completedTodos} completed</span>}
      </div>
      
      {completedTodos > 0 && (
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-xs"
          onClick={clearCompletedTodos}
        >
          <Trash2 className="mr-1 h-3 w-3" />
          Clear completed
        </Button>
      )}
    </div>
  );
}
