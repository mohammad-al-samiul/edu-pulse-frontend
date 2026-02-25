import { CourseStatus } from "./enums";

export interface ICourse {
  id: string;
  title: string;
  description: string;
  thumbnail?: string | null;
  status: CourseStatus;
  price: number;
  isFree?: boolean;
  categoryId: string;
  category?: {
    id: string;
    name: string;
    createdAt: string;
  };
  instructorId: string;
  instructor?: {
    id: string;
    name: string;
    email: string;
  };
  totalLessons?: number;
  totalEnrollments?: number;
  totalRevenue?: number;
  deletedAt?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface ICourseCreate {
  title: string;
  description: string;
  price: number;
  categoryId: string;
  isFree: boolean;
}

export interface ICourseUpdate {
  title?: string;
  description?: string;
  status?: CourseStatus;
  price?: number;
  isFree?: boolean;
  categoryId?: string;
}

export interface ICourseFilters {
  page?: number;
  limit?: number;
  categoryId?: string;
  status?: CourseStatus;
}
