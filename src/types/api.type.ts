 export interface ApiResponse<T> {
   success: boolean;
   message: string;
   data: T;
 }
 
 export interface CursorResponse<T> {
   data: T[];
   nextCursor: string | null;
 }
 
 export interface ICourse {
   id: string;
   title: string;
   status: string;
   price: number;
   isFree?: boolean;
   category?: { name: string };
 }
