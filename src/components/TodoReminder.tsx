
import React, { useEffect, useState } from "react";
import { Bell, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTodos } from "@/components/TodoContext";
import { formatDistanceToNow } from "date-fns";
import { toast } from "@/hooks/use-toast";
import { Todo } from "@/lib/types";

export function TodoReminder() {
  const { todos } = useTodos();
  const [now, setNow] = useState(new Date());
  const [activeReminders, setActiveReminders] = useState<Todo[]>([]);
  
  // Update current time every minute
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 60000);
    
    return () => clearInterval(interval);
  }, []);
  
  // Check for due reminders
  useEffect(() => {
    const checkReminders = () => {
      const currentTime = new Date();
      const dueReminders = todos.filter(todo => 
        todo.reminder && 
        !todo.completed && 
        todo.reminder.getTime() <= currentTime.getTime() && 
        todo.reminder.getTime() > currentTime.getTime() - 60000 // Only trigger if within the last minute
      );
      
      // Notify for new due reminders
      dueReminders.forEach(todo => {
        if (!activeReminders.some(r => r.id === todo.id)) {
          toast({
            title: "⏰ Reminder",
            description: todo.text,
            className: "animate-bounce",
          });
        }
      });
      
      setActiveReminders(dueReminders);
    };
    
    // Check immediately and then set interval
    checkReminders();
    const interval = setInterval(checkReminders, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, [todos, activeReminders]);
  
  // Get upcoming reminders (within the next hour)
  const upcomingReminders = todos.filter(todo => 
    todo.reminder && 
    !todo.completed && 
    todo.reminder.getTime() > now.getTime() && 
    todo.reminder.getTime() <= now.getTime() + 3600000 // Next hour
  ).sort((a, b) => (a.reminder!.getTime() - b.reminder!.getTime()));
  
  if (upcomingReminders.length === 0 && activeReminders.length === 0) {
    return null;
  }
  
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className={`relative ${activeReminders.length > 0 ? 'animate-pulse' : ''}`}
        >
          <Bell className="h-4 w-4 mr-1" />
          <span>Reminders</span>
          {(upcomingReminders.length > 0 || activeReminders.length > 0) && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {activeReminders.length + upcomingReminders.length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          {activeReminders.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Due Now</h3>
              {activeReminders.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-2 bg-destructive/10 rounded animate-pulse">
                  <div className="flex items-center">
                    <Bell className="h-4 w-4 mr-2 text-destructive" />
                    <span className="text-sm font-medium">{todo.text}</span>
                  </div>
                  <span className="text-xs text-destructive">Now</span>
                </div>
              ))}
            </div>
          )}
          
          {upcomingReminders.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-medium text-sm">Upcoming</h3>
              {upcomingReminders.map((todo) => (
                <div key={todo.id} className="flex items-center justify-between p-2 bg-muted rounded">
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 mr-2 text-muted-foreground" />
                    <span className="text-sm">{todo.text}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    in {formatDistanceToNow(todo.reminder!, { addSuffix: false })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
