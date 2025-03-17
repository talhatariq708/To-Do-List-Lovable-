
import { useState } from "react";
import { Droplets, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AddReminderFormProps {
  onAdd: (title: string, message: string, interval: string, icon: 'water' | 'meeting' | 'custom') => void;
  onCancel: () => void;
}

export function AddReminderForm({ onAdd, onCancel }: AddReminderFormProps) {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [interval, setInterval] = useState("10");
  const [icon, setIcon] = useState<'water' | 'meeting' | 'custom'>('water');

  const handleSubmit = () => {
    if (!title.trim() || !message.trim() || !interval.trim()) return;
    
    onAdd(title, message, interval, icon);
    
    // Reset form
    setTitle("");
    setMessage("");
    setInterval("10");
    setIcon('water');
  };

  return (
    <Alert>
      <AlertTitle>Add New Reminder</AlertTitle>
      <AlertDescription>
        <div className="mt-2 space-y-3">
          <div className="grid gap-1.5">
            <label htmlFor="title" className="text-sm font-medium">Title</label>
            <input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              placeholder="Drink Water"
            />
          </div>
          
          <div className="grid gap-1.5">
            <label htmlFor="message" className="text-sm font-medium">Message</label>
            <input
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              value={interval}
              onChange={(e) => setInterval(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          
          <div className="grid gap-1.5">
            <label className="text-sm font-medium">Icon</label>
            <div className="flex gap-2">
              <Button 
                variant={icon === 'water' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setIcon('water')}
              >
                <Droplets className="h-4 w-4 mr-1" />
                Water
              </Button>
              <Button 
                variant={icon === 'meeting' ? 'default' : 'outline'} 
                size="sm" 
                onClick={() => setIcon('meeting')}
              >
                <Clock className="h-4 w-4 mr-1" />
                Meeting
              </Button>
            </div>
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={!title.trim() || !message.trim() || !interval.trim()}
          >
            Add Reminder
          </Button>
        </div>
      </AlertDescription>
    </Alert>
  );
}
