"use client";

import { Loader2, Play, Clock, CheckCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useGetMyEnrollmentsQuery } from "@/features/enrollments/enrollmentsApi";
import type { IEnrollment } from "@/types/enrollment.type";
import { EnrollmentStatus } from "@/types/enums";

export default function MyCoursesPage() {
  const { data: enrollmentsData, isLoading } = useGetMyEnrollmentsQuery();
  const enrollments = enrollmentsData || [];

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
        <h1 className="text-3xl font-bold tracking-tight">My Courses</h1>
        <p className="text-muted-foreground">Continue your learning journey</p>
      </div>

      {enrollments.length === 0 ? (
        <Card>
          <CardContent className="py-16 text-center">
            <div className="mx-auto w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-4">
              <Play className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium mb-2">No courses yet</h3>
            <p className="text-muted-foreground mb-6">
              You haven&apos;t enrolled in any courses yet. Start exploring our
              course catalog!
            </p>
            <Link href="/student/courses">
              <Button>Browse Courses</Button>
            </Link>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {enrollments.map((enrollment: IEnrollment) => (
            <Card key={enrollment.id} className="flex flex-col">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">
                      {enrollment.course?.title}
                    </CardTitle>
                    <CardDescription className="line-clamp-2">
                      {enrollment.course?.description}
                    </CardDescription>
                  </div>
                  <Badge
                    variant={
                      enrollment.status === EnrollmentStatus.COMPLETED
                        ? "default"
                        : "secondary"
                    }
                    className="shrink-0"
                  >
                    {enrollment.status === EnrollmentStatus.COMPLETED
                      ? "Completed"
                      : "In Progress"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="flex-1 space-y-4">
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="text-xs">
                    {enrollment.course?.category?.name || "General"}
                  </Badge>
                  {enrollment.course?.isFree ? (
                    <Badge variant="outline" className="text-xs text-green-600">
                      Free
                    </Badge>
                  ) : (
                    <span className="text-xs text-muted-foreground">
                      ${enrollment.course?.price}
                    </span>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{enrollment.progress}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted">
                    <div
                      className="h-2 rounded-full bg-primary transition-all"
                      style={{ width: `${enrollment.progress}%` }}
                    />
                  </div>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    <span>Last accessed: {enrollment.lastAccessed}</span>
                  </div>
                  {enrollment.status === EnrollmentStatus.COMPLETED && (
                    <div className="flex items-center gap-1 text-green-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Completed</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button className="flex-1" size="sm">
                    {enrollment.status === EnrollmentStatus.COMPLETED
                      ? "Review"
                      : "Continue"}
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
