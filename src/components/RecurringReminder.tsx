
import React, { useEffect, useState } from "react";
import { Droplets, Clock, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { toast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";
import { 
  AlertDialog, 
  AlertDialogAction, 
  AlertDialogCancel, 
  AlertDialogContent, 
  AlertDialogDescription, 
  AlertDialogFooter, 
  AlertDialogHeader, 
  AlertDialogTitle, 
  AlertDialogTrigger 
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface RecurringReminder {
  id: string;
  title: string;
  message: string;
  intervalMinutes: number; // Interval in minutes
  icon: 'water' | 'meeting' | 'custom';
  lastTriggered?: Date; // When the reminder was last triggered
  enabled: boolean;
}

export function RecurringReminders() {
  const [reminders, setReminders] = useState<RecurringReminder[]>(() => {
    const saved = localStorage.getItem("recurringReminders");
    if (saved) {
      try {
        return JSON.parse(saved).map((reminder: any) => ({
          ...reminder,
          lastTriggered: reminder.lastTriggered ? new Date(reminder.lastTriggered) : undefined
        }));
      } catch (e) {
        console.error("Failed to parse recurring reminders from localStorage", e);
        return [];
      }
    }
    return [];
  });

  const [newTitle, setNewTitle] = useState("");
  const [newMessage, setNewMessage] = useState("");
  const [newInterval, setNewInterval] = useState("10");
  const [newIcon, setNewIcon] = useState<'water' | 'meeting' | 'custom'>('water');
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("recurringReminders", JSON.stringify(reminders));
  }, [reminders]);

  // Check for due reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      
      setReminders(prev => 
        prev.map(reminder => {
          if (!reminder.enabled) return reminder;
          
          const lastTriggered = reminder.lastTriggered || new Date(0);
          const millisSinceLastTrigger = now.getTime() - lastTriggered.getTime();
          const minutesSinceLastTrigger = millisSinceLastTrigger / (1000 * 60);
          
          if (minutesSinceLastTrigger >= reminder.intervalMinutes) {
            // Trigger notification
            toast({
              title: reminder.title,
              description: reminder.message,
              className: "animate-bounce",
            });
            
            return { ...reminder, lastTriggered: now };
          }
          
          return reminder;
        })
      );
    }, 10000); // Check every 10 seconds
    
    return () => clearInterval(interval);
  }, []);

  const addReminder = () => {
    if (!newTitle.trim() || !newMessage.trim() || !newInterval.trim()) return;
    
    const newReminder: RecurringReminder = {
      id: crypto.randomUUID(),
      title: newTitle,
      message: newMessage,
      intervalMinutes: parseInt(newInterval),
      icon: newIcon,
      enabled: true
    };
    
    setReminders(prev => [...prev, newReminder]);
    
    // Reset form
    setNewTitle("");
    setNewMessage("");
    setNewInterval("10");
    setNewIcon('water');
    setIsAddingNew(false);
    
    toast({
      title: "Recurring Reminder Added",
      description: `You'll be reminded every ${newInterval} minutes`,
    });
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => 
        reminder.id === id 
          ? { ...reminder, enabled: !reminder.enabled } 
          : reminder
      )
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    
    toast({
      title: "Reminder Deleted",
      description: "The recurring reminder has been removed",
      variant: "destructive",
    });
  };

  // Calculate time until next reminder
  const getTimeUntilNext = (reminder: RecurringReminder): string => {
    if (!reminder.enabled) return "Disabled";
    if (!reminder.lastTriggered) return "Next: Soon";
    
    const now = new Date();
    const lastTriggered = new Date(reminder.lastTriggered);
    const nextTrigger = new Date(lastTriggered.getTime() + reminder.intervalMinutes * 60 * 1000);
    
    if (nextTrigger <= now) return "Due now";
    
    const diffMs = nextTrigger.getTime() - now.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return "Less than a minute";
    if (diffMins === 1) return "1 minute";
    return `${diffMins} minutes`;
  };

  // Get icon component
  const getIcon = (iconType: 'water' | 'meeting' | 'custom') => {
    switch (iconType) {
      case 'water':
        return <Droplets className="h-4 w-4" />;
      case 'meeting':
        return <Clock className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
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
            <Alert>
              <AlertTitle>Add New Reminder</AlertTitle>
              <AlertDescription>
                <div className="mt-2 space-y-3">
                  <div className="grid gap-1.5">
                    <label htmlFor="title" className="text-sm font-medium">Title</label>
                    <input
                      id="title"
                      value={newTitle}
                      onChange={(e) => setNewTitle(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Drink Water"
                    />
                  </div>
                  
                  <div className="grid gap-1.5">
                    <label htmlFor="message" className="text-sm font-medium">Message</label>
                    <input
                      id="message"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                      placeholder="Time to hydrate!"
                    />
                  </div>
                  
                  <div className="grid gap-1.5">
                    <label htmlFor="interval" className="text-sm font-medium">Remind every (minutes)</label>
                    <input
                      id="interval"
                      type="number"
                      min="1"
                      value={newInterval}
                      onChange={(e) => setNewInterval(e.target.value)}
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                    />
                  </div>
                  
                  <div className="grid gap-1.5">
                    <label className="text-sm font-medium">Icon</label>
                    <div className="flex gap-2">
                      <Button 
                        variant={newIcon === 'water' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setNewIcon('water')}
                      >
                        <Droplets className="h-4 w-4 mr-1" />
                        Water
                      </Button>
                      <Button 
                        variant={newIcon === 'meeting' ? 'default' : 'outline'} 
                        size="sm" 
                        onClick={() => setNewIcon('meeting')}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Meeting
                      </Button>
                    </div>
                  </div>
                  
                  <Button 
                    onClick={addReminder}
                    disabled={!newTitle.trim() || !newMessage.trim() || !newInterval.trim()}
                  >
                    Add Reminder
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
          
          {reminders.length === 0 ? (
            <div className="text-center text-muted-foreground py-4">
              No recurring reminders yet
            </div>
          ) : (
            <div className="space-y-2">
              {reminders.map((reminder) => (
                <div 
                  key={reminder.id} 
                  className={cn(
                    "flex items-center justify-between p-2 rounded",
                    reminder.enabled ? "bg-muted" : "bg-muted/50 opacity-70"
                  )}
                >
                  <div className="flex items-center">
                    {getIcon(reminder.icon)}
                    <div className="ml-2">
                      <div className="text-sm font-medium">{reminder.title}</div>
                      <div className="text-xs text-muted-foreground">Every {reminder.intervalMinutes} mins</div>
                      <div className="text-xs text-muted-foreground">
                        Next: {getTimeUntilNext(reminder)}
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => toggleReminder(reminder.id)}
                      className="h-8 w-8 p-0"
                    >
                      {reminder.enabled ? (
                        <Clock className="h-4 w-4 text-green-500" />
                      ) : (
                        <Clock className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Reminder</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this recurring reminder?
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => deleteReminder(reminder.id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
