
import React, { useState } from "react";
import { Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTodos } from "@/components/TodoContext";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

export function TodoReminderInput({ todoId }: { todoId: string }) {
  const { todos, updateTodoReminder } = useTodos();
  const todo = todos.find(t => t.id === todoId);
  const [open, setOpen] = useState(false);
  
  const [hours, setHours] = useState<string>(
    todo?.reminder ? format(todo.reminder, "HH") : ""
  );
  const [minutes, setMinutes] = useState<string>(
    todo?.reminder ? format(todo.reminder, "mm") : ""
  );

  const handleSetReminder = () => {
    if (!hours || !minutes) return;
    
    const now = new Date();
    const reminderDate = new Date();
    reminderDate.setHours(parseInt(hours));
    reminderDate.setMinutes(parseInt(minutes));
    reminderDate.setSeconds(0);
    
    // If time is in the past, set it for tomorrow
    if (reminderDate < now) {
      reminderDate.setDate(reminderDate.getDate() + 1);
    }
    
    updateTodoReminder(todoId, reminderDate);
    setOpen(false);
  };

  const handleClearReminder = () => {
    updateTodoReminder(todoId, null);
    setOpen(false);
  };

  const reminderSet = todo?.reminder !== undefined;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button 
          variant="ghost" 
          size="sm" 
          className={cn(
            "h-8 w-8 p-0",
            reminderSet && "text-blue-500 hover:text-blue-600"
          )}
        >
          <Clock className="h-4 w-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80" align="end">
        <div className="space-y-4">
          <h4 className="font-medium">Set Reminder</h4>
          
          <div className="flex gap-2">
            <div className="grid gap-1.5">
              <label htmlFor="hours" className="text-sm font-medium">Hour</label>
              <input
                id="hours"
                type="number"
                min="0"
                max="23"
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="HH"
              />
            </div>
            <div className="grid gap-1.5">
              <label htmlFor="minutes" className="text-sm font-medium">Minute</label>
              <input
                id="minutes"
                type="number"
                min="0"
                max="59"
                value={minutes}
                onChange={(e) => setMinutes(e.target.value)}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                placeholder="MM"
              />
            </div>
          </div>
          
          <div className="flex justify-between">
            <Button onClick={handleSetReminder} disabled={!hours || !minutes}>
              Set Reminder
            </Button>
            
            {reminderSet && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">Clear Reminder</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear Reminder</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to clear this reminder?
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleClearReminder}>
                      Clear
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
