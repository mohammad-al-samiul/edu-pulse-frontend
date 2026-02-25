export enum Role {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  INSTRUCTOR = "INSTRUCTOR",
  STUDENT = "STUDENT",
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  SUSPENDED = "SUSPENDED",
}

export enum CourseStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
  ARCHIVED = "ARCHIVED",
}

export enum EnrollmentStatus {
  ACTIVE = "ACTIVE",
  COMPLETED = "COMPLETED",
  DROPPED = "DROPPED",
}
