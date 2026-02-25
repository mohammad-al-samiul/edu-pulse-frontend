export interface IAnalyticsSummary {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  activeUsers: number;
  publishedCourses: number;
}

export interface IEnrollmentGrowth {
  period: string;
  enrollments: number;
  growth: number;
}

export interface ITopCourse {
  id: string;
  title: string;
  enrollments: number;
  revenue: number;
  rating?: number;
}

export interface IRevenue {
  period: string;
  revenue: number;
  growth: number;
}
