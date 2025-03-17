
import { TodoInput } from "@/components/TodoInput";
import { TodoList } from "@/components/TodoList";
import { TodoStats } from "@/components/TodoStats";
import { TodoProvider } from "@/components/TodoContext";
import { TodoReminder } from "@/components/TodoReminder";

export function TodoApp() {
  return (
    <TodoProvider>
      <div className="flex w-full flex-col gap-4">
        <div className="flex items-center justify-between">
          <TodoInput />
          <TodoReminder />
        </div>
        <TodoList />
        <TodoStats />
      </div>
    </TodoProvider>
  );
}
