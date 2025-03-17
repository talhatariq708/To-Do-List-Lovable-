
import React, { useState } from "react";
import { Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useRecurringReminders } from "@/hooks/use-recurring-reminders";
import { ReminderItem } from "@/components/ReminderItem";
import { AddReminderForm } from "@/components/AddReminderForm";

export function RecurringReminders() {
  const { reminders, addReminder, toggleReminder, deleteReminder, getTimeUntilNext } = useRecurringReminders();
  const [isAddingNew, setIsAddingNew] = useState(false);

  const handleAddReminder = (title: string, message: string, interval: string, icon: 'water' | 'meeting' | 'custom') => {
    addReminder(title, message, interval, icon);
    setIsAddingNew(false);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button 
          variant="outline" 
          size="sm" 
          className="relative"
        >
          <Clock className="h-4 w-4 mr-1" />
          <span>Recurring</span>
          {reminders.length > 0 && (
            <span className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
              {reminders.filter(r => r.enabled).length}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Recurring Reminders</h3>
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={() => setIsAddingNew(!isAddingNew)}
              className="h-8 w-8 p-0"
            >
              {isAddingNew ? <X className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            </Button>
          </div>
          
          {isAddingNew && (
            <AddReminderForm 
              onAdd={handleAddReminder}
              onCancel={() => setIsAddingNew(false)}
            />
          )}
          
          {reminders.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No recurring reminders yet
            </div>
          ) : (
            <div className="space-y-2">
              {reminders.map((reminder) => (
                <ReminderItem 
                  key={reminder.id}
                  reminder={reminder}
                  timeUntilNext={getTimeUntilNext(reminder)}
                  onToggle={toggleReminder}
                  onDelete={deleteReminder}
                />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
