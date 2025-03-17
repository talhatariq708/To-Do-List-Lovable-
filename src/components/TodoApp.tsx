
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";
import { TodoStats } from "@/components/TodoStats";
import { TodoProvider } from "@/components/TodoContext";

export function TodoApp() {
  return (
    <TodoProvider>
      <div className="flex w-full flex-col gap-4">
        <TodoInput />
        <TodoList />
        <TodoStats />
      </div>
    </TodoProvider>
  );
}
