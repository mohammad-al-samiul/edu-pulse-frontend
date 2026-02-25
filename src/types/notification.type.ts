export interface INotification {
  id: string;
  title: string;
  message: string;
  type: "INFO" | "WARNING" | "ERROR" | "SUCCESS";
  isRead: boolean;
  createdAt?: string;
  userId?: string;
}
