"use client";

import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BookOpen, Clock, TrendingUp, Search, Play } from "lucide-react";
import { useGetCoursesQuery } from "@/features/courses/coursesApi";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export default function StudentDashboardPage() {
  const { data: coursesData, isLoading } = useGetCoursesQuery({
    status: "ACTIVE",
  });

  const courses = Array.isArray(coursesData)
    ? coursesData
    : (coursesData as { data?: unknown[] })?.data || [];

  const enrolledCourses: unknown[] = []; // This would come from enrollment API
  const completedLessons = 0; // This would come from progress API

  const stats = [
    {
      title: "Enrolled Courses",
      value: enrolledCourses.length.toString(),
      description: "Courses you're learning",
      icon: BookOpen,
    },
    {
      title: "Completed Lessons",
      value: completedLessons.toString(),
      description: "Total lessons completed",
      icon: TrendingUp,
    },
    {
      title: "In Progress",
      value: enrolledCourses.length.toString(),
      description: "Courses in progress",
      icon: Clock,
    },
    {
      title: "Certificates",
      value: "0",
      description: "Certificates earned",
      icon: BookOpen,
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
        <p className="text-muted-foreground">Continue your learning journey</p>
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
        {/* Continue Learning */}
        <Card>
          <CardHeader>
            <CardTitle>Continue Learning</CardTitle>
            <CardDescription>Pick up where you left off</CardDescription>
          </CardHeader>
          <CardContent>
            {enrolledCourses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t enrolled in any courses yet
                </p>
                <Link href="/student/courses">
                  <button className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-10 px-4 py-2">
                    <Search className="mr-2 h-4 w-4" />
                    Browse Courses
                  </button>
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {enrolledCourses.slice(0, 3).map((course: unknown) => (
                  <div
                    key={(course as { id: string }).id}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {(course as { title: string }).title}
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="h-2 w-24 rounded-full bg-muted">
                          <div
                            className="h-2 rounded-full bg-primary"
                            style={{ width: "30%" }}
                          />
                        </div>
                        <span className="text-xs text-muted-foreground">
                          30% complete
                        </span>
                      </div>
                    </div>
                    <button className="p-2 rounded-full bg-primary/10 text-primary hover:bg-primary/20">
                      <Play className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Browse More Courses */}
        <Card>
          <CardHeader>
            <CardTitle>Explore Courses</CardTitle>
            <CardDescription>Discover new skills to learn</CardDescription>
          </CardHeader>
          <CardContent>
            {courses.length === 0 ? (
              <p className="text-muted-foreground text-center py-6">
                No courses available at the moment
              </p>
            ) : (
              <div className="space-y-4">
                {courses
                  .slice(0, 3)
                  .map(
                    (course: {
                      id: string;
                      title: string;
                      category: { name: string };
                      price: number;
                      isFree: boolean;
                    }) => (
                      <div
                        key={course.id}
                        className="flex items-center justify-between"
                      >
                        <div className="space-y-1">
                          <p className="text-sm font-medium leading-none">
                            {course.title}
                          </p>
                          <div className="flex items-center gap-2">
                            <Badge variant="secondary" className="text-xs">
                              {course.category?.name || "General"}
                            </Badge>
                            {course.isFree ? (
                              <Badge
                                variant="outline"
                                className="text-xs text-green-600"
                              >
                                Free
                              </Badge>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                ${course.price}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ),
                  )}
                <Link href="/student/courses">
                  <button className="w-full mt-2 inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2">
                    View All Courses
                  </button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
