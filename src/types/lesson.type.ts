export interface ILesson {
  id: string;
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  isPreview: boolean;
  courseId: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ILessonCreate {
  title: string;
  content: string;
  videoUrl?: string;
  order: number;
  isPreview: boolean;
  courseId: string;
}

export interface ILessonUpdate {
  title?: string;
  content?: string;
  videoUrl?: string;
  order?: number;
  isPreview?: boolean;
}

export interface ILessonComplete {
  progress?: number;
  status?: string;
}
