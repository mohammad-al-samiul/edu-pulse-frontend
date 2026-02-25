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
  BookOpen,
  Users,
  TrendingUp,
  DollarSign,
  Plus,
  Eye,
} from "lucide-react";
import { useGetCoursesQuery } from "@/features/courses/coursesApi";
import { CourseStatus } from "@/types/enums";
import type { ICourse } from "@/types/course.type";
import Link from "next/link";

export default function InstructorDashboardPage() {
  const { data: coursesData, isLoading } = useGetCoursesQuery({});

  const courses = coursesData?.courses || [];

  const totalStudents = courses.reduce(
    (acc: number, course: ICourse) => acc + (course.totalEnrollments || 0),
    0,
  );

  const stats = [
    {
      title: "My Courses",
      value: courses.length.toString(),
      description: "Total courses created",
      icon: BookOpen,
    },
    {
      title: "Total Students",
      value: totalStudents.toString(),
      description: "Enrolled students",
      icon: Users,
    },
    {
      title: "Published Courses",
      value: courses
        .filter((c: { status?: string }) => c.status === CourseStatus.PUBLISHED)
        .length.toString(),
      description: "Published courses",
      icon: TrendingUp,
    },
    {
      title: "Revenue",
      value: "$0",
      description: "This month",
      icon: DollarSign,
    },
  ];

  if (isLoading) {
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
          Manage your courses and track performance
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
        {/* Recent Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Courses</CardTitle>
            <CardDescription>Your latest created courses</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t created any courses yet
                </p>
                <Link href="/instructor/courses/new">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Course
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {courses.slice(0, 5).map((course: ICourse) => (
                  <div
                    key={course.id}
                    className="flex items-center justify-between"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {course.title}
                      </p>
                      <p className="text-xs text-muted-foreground capitalize">
                        {course.status?.toLowerCase() || "draft"}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-muted-foreground">
                        {course.totalEnrollments || 0} students
                      </span>
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
            <CardDescription>Common tasks for instructors</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-2">
            <Link
              href="/instructor/courses/new"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition"
            >
              <span className="text-sm font-medium">Create New Course</span>
              <Plus className="h-4 w-4 text-muted-foreground" />
            </Link>
            <Link
              href="/instructor/courses"
              className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition"
            >
              <span className="text-sm font-medium">View All Courses</span>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </Link>
            <div className="flex items-center justify-between p-3 rounded-lg border hover:bg-accent transition cursor-pointer">
              <span className="text-sm font-medium">View Analytics</span>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
