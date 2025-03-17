
import { Droplets, Clock, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RecurringReminder } from "@/lib/recurring-reminder-types";
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

interface ReminderItemProps {
  reminder: RecurringReminder;
  timeUntilNext: string;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ReminderItem({ reminder, timeUntilNext, onToggle, onDelete }: ReminderItemProps) {
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
    <div 
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
            Next: {timeUntilNext}
          </div>
        </div>
      </div>
      <div className="flex gap-1">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => onToggle(reminder.id)}
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
              <AlertDialogAction onClick={() => onDelete(reminder.id)}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
