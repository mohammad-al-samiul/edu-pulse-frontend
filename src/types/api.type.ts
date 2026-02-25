export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface CursorResponse<T> {
  data: T[];
  nextCursor: string | null;
}
