
import { useState } from "react";
import { Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTodos } from "@/components/TodoContext";

export function TodoInput() {
  const [text, setText] = useState("");
  const { addTodo } = useTodos();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (text.trim()) {
      addTodo(text);
      setText("");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex w-full gap-2 animate-in fade-in slide-in-from-top-4 duration-300">
      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Add a task..."
        className="flex-1 transition-all duration-200"
      />
      <Button type="submit" size="icon" className="shrink-0 transition-transform hover:scale-105">
        <Plus className="h-4 w-4" />
      </Button>
    </form>
  );
}
