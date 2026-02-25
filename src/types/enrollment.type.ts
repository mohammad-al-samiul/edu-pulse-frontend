import { EnrollmentStatus } from "./enums";

export interface IEnrollment {
  id: string;
  courseId: string;
  studentId: string;
  status: EnrollmentStatus;
  enrolledAt?: string;
  completedAt?: string;
  progress?: number;
  lastAccessed?: string;
  course?: {
    id: string;
    title: string;
    price: number;
    description?: string;
    isFree?: boolean;
    category?: { name: string };
  };
  student?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface IEnrollmentCreate {
  courseId: string;
}

export interface IEnrollmentUpdate {
  status?: EnrollmentStatus;
  progress?: number;
}
