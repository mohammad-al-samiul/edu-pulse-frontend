"use client";

import { Loader2, UserMinus, UserPlus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetCoursesQuery } from "@/features/courses/coursesApi";
import {
  useCreateEnrollmentMutation,
  useDeleteEnrollmentMutation,
  useGetMyEnrollmentsQuery,
} from "@/features/enrollments/enrollmentsApi";
import { CourseStatus } from "@/types/enums";
import type { ICourse } from "@/types/course.type";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApi";
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function StudentCoursesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const { toast } = useToast();

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = Array.isArray(categoriesData) ? categoriesData : [];

  const {
    data: coursesData,
    isLoading,
    error,
  } = useGetCoursesQuery({
    page,
    limit,
    categoryId,
    status: CourseStatus.PUBLISHED,
  });
  const [enroll, { isLoading: isEnrolling }] = useCreateEnrollmentMutation();
  const [unenroll, { isLoading: isUnenrolling }] =
    useDeleteEnrollmentMutation();
  const { data: enrollmentsData, refetch: refetchEnrollments } =
    useGetMyEnrollmentsQuery();

  const courses = coursesData?.courses || [];
  const enrolledCourseIds = enrollmentsData?.map((e) => e.courseId) || [];

  const isEnrolled = (courseId: string) => enrolledCourseIds.includes(courseId);

  const handleEnrollmentToggle = async (
    courseId: string,
    isCurrentlyEnrolled: boolean,
  ) => {
    try {
      if (isCurrentlyEnrolled) {
        // Unenroll
        await unenroll({ courseId }).unwrap();
        toast({
          title: "Successfully Unenrolled",
          description: "You have been removed from this course.",
          variant: "default",
        });
      } else {
        // Enroll
        await enroll({ courseId }).unwrap();
        toast({
          title: "Successfully Enrolled!",
          description: "You can now access this course from your dashboard.",
          variant: "success",
        });
      }
      // Only refetch enrollments, not courses
      refetchEnrollments();
    } catch (error: unknown) {
      console.error("Enrollment error:", error);

      // Type guard for error with data property
      const errorWithMessage = error as {
        data?: { message?: string };
        status?: number;
      };

      // Handle different error types
      if (errorWithMessage?.data?.message === "Already enrolled") {
        toast({
          title: "Already Enrolled",
          description: "You are already enrolled in this course.",
          variant: "destructive",
        });
      } else if (errorWithMessage?.status === 400) {
        toast({
          title: "Operation Failed",
          description:
            errorWithMessage?.data?.message ||
            "Unable to process this request.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Operation Error",
          description: "An unexpected error occurred. Please try again.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-96">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>Failed to load courses</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Courses</h1>
          <p className="text-muted-foreground">Browse and enroll</p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            onValueChange={(v) => setCategoryId(v === "all" ? undefined : v)}
            value={categoryId || "all"}
          >
            <SelectTrigger className="w-56">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c.id} value={c.id}>
                  {c.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(v) => setLimit(Number(v))}>
            <SelectTrigger className="w-28">
              <SelectValue placeholder="Page size" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="12">12</SelectItem>
              <SelectItem value="24">24</SelectItem>
              <SelectItem value="48">48</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {courses.length === 0 ? (
          <Card>
            <CardContent className="py-6 text-center text-muted-foreground">
              No courses available
            </CardContent>
          </Card>
        ) : (
          courses.map((course: ICourse) => (
            <Card key={course.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{course.title}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
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
                      {isEnrolled(course.id) && (
                        <Badge
                          variant="default"
                          className="text-xs bg-emerald-500"
                        >
                          Enrolled
                        </Badge>
                      )}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <span>
                      Instructor: {course.instructor?.name || "Unknown"}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span>{course.totalEnrollments || 0} enrolled</span>
                  </div>
                </div>
                {isEnrolled(course.id) ? (
                  <Button
                    onClick={() => handleEnrollmentToggle(course.id, true)}
                    disabled={isUnenrolling}
                    variant="outline"
                    className="w-full"
                  >
                    {isUnenrolling ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserMinus className="mr-2 h-4 w-4" />
                    )}
                    Unenroll
                  </Button>
                ) : (
                  <Button
                    onClick={() => handleEnrollmentToggle(course.id, false)}
                    disabled={isEnrolling}
                    className="w-full"
                  >
                    {isEnrolling ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <UserPlus className="mr-2 h-4 w-4" />
                    )}
                    Enroll
                  </Button>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <span className="text-sm text-muted-foreground">Page {page}</span>
        <Button variant="outline" onClick={() => setPage((p) => p + 1)}>
          Next
        </Button>
      </div>
    </div>
  );
}
