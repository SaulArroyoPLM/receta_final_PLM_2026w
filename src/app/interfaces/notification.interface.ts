export interface Notification {
  id: number;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  icon: string;
  time: string;
  unread: boolean;
  link?: string;  // ahora sí es opcional y funcional
  actions?: NotificationAction[];
}

export interface NotificationAction {
  action: string;
  label: string;
  icon: string;
}
