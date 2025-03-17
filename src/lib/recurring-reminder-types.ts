
export interface RecurringReminder {
  id: string;
  title: string;
  message: string;
  intervalMinutes: number; // Interval in minutes
  icon: 'water' | 'meeting' | 'custom';
  lastTriggered?: Date; // When the reminder was last triggered
  enabled: boolean;
}
