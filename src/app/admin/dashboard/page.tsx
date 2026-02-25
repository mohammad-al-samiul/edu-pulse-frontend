"use client";

import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  BookOpen,
  TrendingUp,
  DollarSign,
  BarChart3,
  BookMarked,
} from "lucide-react";
import {
  useGetAnalyticsSummaryQuery,
  useGetTopCoursesQuery,
  useGetRevenueQuery,
} from "@/features/analytics/analyticsApi";

export default function AdminDashboardPage() {
  const { data: summaryData, isLoading: isSummaryLoading } =
    useGetAnalyticsSummaryQuery();
  const { data: topCoursesData, isLoading: isCoursesLoading } =
    useGetTopCoursesQuery();
  const { data: revenueData, isLoading: isRevenueLoading } =
    useGetRevenueQuery();

  const summary = summaryData as
    | {
        totalUsers?: number;
        totalCourses?: number;
        totalEnrollments?: number;
        activeCourses?: number;
      }
    | undefined;

  const topCourses =
    (topCoursesData as { title: string; enrollments: number }[]) || [];
  const revenue = revenueData as
    | { total?: number; growth?: number }
    | undefined;

  const stats = [
    {
      title: "Total Users",
      value: summary?.totalUsers?.toLocaleString() || "0",
      description: "Registered users",
      icon: Users,
    },
    {
      title: "Total Courses",
      value: summary?.totalCourses?.toLocaleString() || "0",
      description: "Active courses",
      icon: BookOpen,
    },
    {
      title: "Enrollments",
      value: summary?.totalEnrollments?.toLocaleString() || "0",
      description: "Total enrollments",
      icon: BookMarked,
    },
    {
      title: "Revenue",
      value: revenue?.total ? `$${revenue.total.toLocaleString()}` : "$0",
      description: revenue?.growth
        ? `${revenue.growth}% from last month`
        : "No data",
      icon: DollarSign,
    },
  ];

  if (isSummaryLoading || isRevenueLoading || isCoursesLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s an overview of your platform.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {/* Top Courses */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5" />
              Top Courses
            </CardTitle>
            <CardDescription>
              Most popular courses by enrollment
            </CardDescription>
          </CardHeader>
          <CardContent>
            {topCourses.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">
                No course data available
              </p>
            ) : (
              <div className="space-y-4">
                {topCourses.slice(0, 5).map((course, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {course.enrollments} enrollments
                      </p>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <TrendingUp className="h-3 w-3 text-green-500" />
                      <span>{course.enrollments}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <a
              href="/admin/categories"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition"
            >
              <span className="text-sm font-medium">Manage Categories</span>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="/admin/users"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition"
            >
              <span className="text-sm font-medium">Manage Users</span>
              <Users className="h-4 w-4 text-muted-foreground" />
            </a>
            <a
              href="/admin/courses"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition"
            >
              <span className="text-sm font-medium">View All Courses</span>
              <BookMarked className="h-4 w-4 text-muted-foreground" />
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
