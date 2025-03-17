
import { useTodos } from "@/components/TodoContext";
import { TodoItem } from "@/components/TodoItem";

export function TodoList() {
  const { todos } = useTodos();

  if (todos.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center animate-in fade-in duration-500">
        <p className="text-lg font-medium text-muted-foreground">No tasks yet</p>
        <p className="text-sm text-muted-foreground">Add a task to get started</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} />
      ))}
    </div>
  );
}
