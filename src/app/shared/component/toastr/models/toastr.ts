export type ToastrType = 'success' | 'error' | 'info' | 'warning';

export interface ToastrMessage {
  id: string;
  message: string;
  title?: string;
  type: ToastrType;
  duration?: number;
  isClosing?: boolean;
}
