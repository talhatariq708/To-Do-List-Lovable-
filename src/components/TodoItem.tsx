
import { useState } from "react";
import { CheckCircle2, Circle, Trash2, Edit2, Save } from "lucide-react";
import { cn } from "@/lib/utils";
import { Todo } from "@/lib/types";
import { useTodos } from "@/components/TodoContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface TodoItemProps {
  todo: Todo;
}

export function TodoItem({ todo }: TodoItemProps) {
  const { toggleTodo, deleteTodo } = useTodos();
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(todo.text);

  const handleToggle = () => {
    toggleTodo(todo.id);
  };

  return (
    <div 
      className={cn(
        "group flex items-center justify-between gap-2 rounded-md border p-3 transition-all",
        "animate-in fade-in-50 slide-in-from-left-8 duration-300",
        todo.completed && "bg-muted text-muted-foreground"
      )}
    >
      <div className="flex items-center gap-3">
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-6 w-6 rounded-full p-0 text-primary/80 hover:text-primary" 
          onClick={handleToggle}
        >
          {todo.completed ? 
            <CheckCircle2 className="h-5 w-5 transition-transform hover:scale-110" /> : 
            <Circle className="h-5 w-5 transition-transform hover:scale-110" />
          }
        </Button>
        
        {isEditing ? (
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              if (editedText.trim()) {
                todo.text = editedText;
                setIsEditing(false);
              }
            }}
            className="flex-1"
          >
            <Input
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
              className="h-7 py-1"
              autoFocus
            />
          </form>
        ) : (
          <span 
            className={cn(
              "font-medium transition-all duration-200",
              todo.completed && "line-through"
            )}
          >
            {todo.text}
          </span>
        )}
      </div>
      
      <div className="flex items-center opacity-0 transition-opacity group-hover:opacity-100">
        {isEditing ? (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 rounded-full p-0 text-primary"
            onClick={() => {
              if (editedText.trim()) {
                todo.text = editedText;
                setIsEditing(false);
              }
            }}
          >
            <Save className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            size="icon" 
            variant="ghost" 
            className="h-7 w-7 rounded-full p-0 text-primary"
            onClick={() => setIsEditing(true)}
          >
            <Edit2 className="h-4 w-4" />
          </Button>
        )}
        
        <Button 
          size="icon" 
          variant="ghost" 
          className="h-7 w-7 rounded-full p-0 text-destructive"
          onClick={() => deleteTodo(todo.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
