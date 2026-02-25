"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Loader2, CheckCircle2, XCircle, Filter, Plus } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  useGetCoursesQuery,
  useUpdateCourseMutation,
} from "@/features/courses/coursesApi";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApi";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function InstructorCoursesPage() {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [categoryId, setCategoryId] = useState<string | undefined>(undefined);
  const [status, setStatus] = useState<string | undefined>(undefined);

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
    status,
  });
  const [updateCourse, { isLoading: isUpdating }] = useUpdateCourseMutation();

  const courses = Array.isArray(coursesData)
    ? coursesData
    : (coursesData as { data?: unknown[] })?.data || [];

  useEffect(() => {
    refetch();
  }, [page, limit, categoryId, status, refetch]);

  const handlePublish = async (id: string) => {
    await updateCourse({ id, body: { status: "ACTIVE" } }).unwrap();
    refetch();
  };

  const handleUnpublish = async (id: string) => {
    await updateCourse({ id, body: { status: "DRAFT" } }).unwrap();
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
          <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
          <p className="text-muted-foreground">
            Manage and publish your courses
          </p>
        </div>
        <Link href="/instructor/courses/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            New Course
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Courses</CardTitle>
            <CardDescription>Filter and publish</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <Select onValueChange={(v) => setStatus(v || undefined)}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="DRAFT">Draft</SelectItem>
                <SelectItem value="">All</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setCategoryId(v || undefined)}>
              <SelectTrigger className="w-56">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}
                  </SelectItem>
                ))}
                <SelectItem value="">All</SelectItem>
              </SelectContent>
            </Select>
            <Select onValueChange={(v) => setLimit(Number(v))}>
              <SelectTrigger className="w-28">
                <SelectValue placeholder="Page size" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="20">20</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          {courses.length === 0 ? (
            <p className="text-muted-foreground text-center py-6">
              No courses found
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {courses.map(
                  (course: {
                    id: string;
                    title: string;
                    status: string;
                    enrollments?: number;
                    price: number;
                    isFree?: boolean;
                    category?: { name: string };
                  }) => (
                    <TableRow key={course.id}>
                      <TableCell className="font-medium">
                        {course.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">
                          {course.category?.name || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            course.status === "ACTIVE" ? "secondary" : "outline"
                          }
                        >
                          {course.status?.toLowerCase()}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {course.isFree ? (
                          <Badge variant="outline" className="text-green-600">
                            Free
                          </Badge>
                        ) : (
                          <span className="text-sm text-muted-foreground">
                            ${course.price}
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        {course.status !== "ACTIVE" ? (
                          <Button
                            size="sm"
                            onClick={() => handlePublish(course.id)}
                            disabled={isUpdating}
                          >
                            <CheckCircle2 className="mr-1 h-4 w-4" />
                            Publish
                          </Button>
                        ) : (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleUnpublish(course.id)}
                            disabled={isUpdating}
                          >
                            <XCircle className="mr-1 h-4 w-4" />
                            Unpublish
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ),
                )}
              </TableBody>
            </Table>
          )}

          <div className="flex items-center justify-between mt-4">
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
        </CardContent>
      </Card>
    </div>
  );
}
