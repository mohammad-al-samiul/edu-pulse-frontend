"use client";

import { useState } from "react";
import { useForm, type SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/courses/coursesApi";
import { useGetCategoriesQuery } from "@/features/categories/categoriesApi";
import { useToast } from "@/components/ui/use-toast";
import { useRouter } from "next/navigation";

const createCourseSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  price: z.number().min(0),
  isFree: z.boolean(),
  categoryId: z.string().min(1),
});

type CreateCourseForm = z.infer<typeof createCourseSchema>;

export default function NewCoursePage() {
  const router = useRouter();
  const { toast } = useToast();
  const { data: categoriesData } = useGetCategoriesQuery();
  const [createCourse, { isLoading }] = useCreateCourseMutation();
  const categories = categoriesData || [];

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<CreateCourseForm>({
    resolver: zodResolver(createCourseSchema),
    defaultValues: {
      isFree: false,
      price: 0,
    },
  });

  const onSubmit: SubmitHandler<CreateCourseForm> = async (data) => {
    try {
      await createCourse({
        title: data.title,
        description: data.description,
        price: data.price,
        isFree: data.isFree,
        categoryId: data.categoryId,
      }).unwrap();
      toast({ title: "Course created", variant: "success" });
      router.replace("/instructor/courses");
    } catch {
      toast({ title: "Failed to create course", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create Course</h1>
        <p className="text-muted-foreground">
          Define basic details for your course
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Course Details</CardTitle>
          <CardDescription>
            Title, description, pricing, and category
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                placeholder="Intro to Web Development"
                {...register("title")}
              />
              {errors.title && (
                <p className="text-sm text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                placeholder="Describe your course"
                {...register("description")}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  onValueChange={(value) => {
                    setValue("categoryId", value);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => (
                      <SelectItem key={c.id} value={c.id}>
                        {c.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.categoryId && (
                  <p className="text-sm text-destructive">
                    {errors.categoryId.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  {...register("price", { valueAsNumber: true })}
                />
                {errors.price && (
                  <p className="text-sm text-destructive">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="isFree">Free</Label>
                <Select
                  onValueChange={(value) =>
                    setValue("isFree", value === "true")
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="No" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="false">No</SelectItem>
                    <SelectItem value="true">Yes</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex justify-end">
              <Button type="submit" disabled={isLoading}>
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
