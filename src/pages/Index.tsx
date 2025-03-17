
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { TodoApp } from "@/components/TodoApp";

const Index = () => {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
        <div className="container mx-auto p-4">
          <header className="flex items-center justify-between py-6">
            <h1 className="animate-in fade-in slide-in-from-left duration-500 text-2xl font-bold">
              To-Do List
            </h1>
            <ThemeToggle />
          </header>
          
          <main className="mx-auto max-w-2xl">
            <div className="rounded-lg border bg-card p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
              <TodoApp />
            </div>
          </main>
          
          <footer className="mt-8 py-4 text-center text-sm text-muted-foreground">
            <p>Simple Todo App with React & Tailwind CSS</p>
          </footer>
        </div>
      </div>
    </ThemeProvider>
  );
};

export default Index;
