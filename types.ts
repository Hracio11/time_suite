
export enum PersonaType {
  HOUSEWIFE = 'Ama de Casa',
  STUDENT = 'Estudiante',
  COMMON = 'Persona Común'
}

export interface User {
  id: string;
  email: string;
  name: string;
  persona?: PersonaType;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  priority: 'Baja' | 'Media' | 'Alta';
  dueDate: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  minQuantity: number;
}

export interface Recipe {
  id: string;
  title: string;
  ingredients: string[];
  instructions: string[];
  prepTime: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success';
  timestamp: number;
}
