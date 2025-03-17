
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  reminder?: Date; // Optional reminder time
}
