"use client";

import { Loader2, Play } from "lucide-react";
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
import { useCreateEnrollmentMutation } from "@/features/enrollments/enrollmentsApi";
import { CourseStatus } from "@/types/enums";
import type { ICourse } from "@/types/course.type";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApi";
import { useState, useMemo } from "react";
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

  const { data: categoriesData } = useGetCategoriesQuery();
  const categories = useMemo(() => {
    const raw =
      (categoriesData as
        | { data?: Array<{ id: string; name: string }> }
        | Array<{ id: string; name: string }>
        | null) ?? null;
    return Array.isArray(raw)
      ? raw
      : Array.isArray(raw?.data)
        ? raw!.data!
        : [];
  }, [categoriesData]);

  const {
    data: coursesData,
    isLoading,
    error,
    refetch,
  } = useGetCoursesQuery({
    page,
    limit,
    categoryId,
    status: CourseStatus.PUBLISHED,
  });
  const [enroll, { isLoading: isEnrolling }] = useCreateEnrollmentMutation();

  const courses = coursesData?.courses || [];

  const handleEnroll = async (id: string) => {
    await enroll({ courseId: id }).unwrap();
    refetch();
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
                <CardTitle className="text-lg">{course.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {course.category?.name || "General"}
                  </Badge>
                  {course.isFree ? (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Free
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      ${course.price}
                    </span>
                  )}
                </CardDescription>
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
                <Button
                  onClick={() => handleEnroll(course.id)}
                  disabled={isEnrolling}
                >
                  <Play className="mr-2 h-4 w-4" />
                  Enroll
                </Button>
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
