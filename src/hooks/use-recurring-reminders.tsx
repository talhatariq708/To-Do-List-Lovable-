
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { RecurringReminder } from "@/lib/recurring-reminder-types";

export function useRecurringReminders() {
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

  const [checkingReminders, setCheckingReminders] = useState(false);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("recurringReminders", JSON.stringify(reminders));
  }, [reminders]);

  // Check for due reminders
  useEffect(() => {
    if (checkingReminders) return; // Prevent concurrent checks

    const checkInterval = setInterval(() => {
      setCheckingReminders(true);
      
      const now = new Date();
      let updatedReminders = false;
      
      setReminders(prev => {
        const newReminders = prev.map(reminder => {
          if (!reminder.enabled) return reminder;
          
          const lastTriggered = reminder.lastTriggered ? new Date(reminder.lastTriggered) : new Date(0);
          const millisSinceLastTrigger = now.getTime() - lastTriggered.getTime();
          const minutesSinceLastTrigger = millisSinceLastTrigger / (1000 * 60);
          
          if (minutesSinceLastTrigger >= reminder.intervalMinutes) {
            // Trigger notification
            toast(reminder.title, {
              description: reminder.message,
              duration: 5000, // Show toast for 5 seconds only
            });
            
            updatedReminders = true;
            return { ...reminder, lastTriggered: now };
          }
          
          return reminder;
        });

        if (updatedReminders) {
          return newReminders;
        }
        return prev;
      });
      
      setCheckingReminders(false);
    }, 10000); // Check every 10 seconds
    
    return () => {
      clearInterval(checkInterval);
      setCheckingReminders(false);
    };
  }, []);

  const addReminder = (title: string, message: string, intervalMinutes: string, icon: 'water' | 'meeting' | 'custom') => {
    if (!title.trim() || !message.trim() || !intervalMinutes.trim()) return;
    
    const now = new Date();
    const newReminder: RecurringReminder = {
      id: crypto.randomUUID(),
      title,
      message,
      intervalMinutes: parseInt(intervalMinutes),
      icon,
      lastTriggered: now, // Set initial trigger time to now
      enabled: true
    };
    
    setReminders(prev => [...prev, newReminder]);
    
    toast("Recurring Reminder Added", {
      description: `You'll be reminded every ${intervalMinutes} minutes`,
      duration: 3000,
    });

    return newReminder;
  };

  const toggleReminder = (id: string) => {
    setReminders(prev => 
      prev.map(reminder => {
        if (reminder.id === id) {
          // If enabling a disabled reminder, update lastTriggered to now
          if (!reminder.enabled) {
            return { 
              ...reminder, 
              enabled: true,
              lastTriggered: new Date() 
            };
          }
          return { ...reminder, enabled: false };
        }
        return reminder;
      })
    );
  };

  const deleteReminder = (id: string) => {
    setReminders(prev => prev.filter(reminder => reminder.id !== id));
    
    toast("Reminder Deleted", {
      description: "The recurring reminder has been removed",
      duration: 3000,
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

  return {
    reminders,
    addReminder,
    toggleReminder,
    deleteReminder,
    getTimeUntilNext
  };
}
