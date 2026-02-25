export const apiTags = {
  // User tags
  USER: "USER",
  USER_LIST: "USER_LIST",
  
  // Category tags
  CATEGORY: "CATEGORY",
  CATEGORY_LIST: "CATEGORY_LIST",
  
  // Course tags
  COURSE: "COURSE",
  COURSE_LIST: "COURSE_LIST",
  
  // Lesson tags
  LESSON: "LESSON",
  LESSON_LIST: "LESSON_LIST",
  
  // Enrollment tags
  ENROLLMENT: "ENROLLMENT",
  ENROLLMENT_LIST: "ENROLLMENT_LIST",
  
  // Notification tags
  NOTIFICATION: "NOTIFICATION",
  NOTIFICATION_LIST: "NOTIFICATION_LIST",
  
  // Analytics tags
  ANALYTICS: "ANALYTICS",
} as const;

export type ApiTag = typeof apiTags[keyof typeof apiTags];
