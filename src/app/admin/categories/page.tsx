 "use client";
 
 import { useState } from "react";
 import { useForm } from "react-hook-form";
 import { zodResolver } from "@hookform/resolvers/zod";
 import { z } from "zod";
 import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
 
 import { Button } from "@/components/ui/button";
 import {
   Card,
   CardContent,
   CardDescription,
   CardHeader,
   CardTitle,
 } from "@/components/ui/card";
 import {
   Table,
   TableBody,
   TableCell,
   TableHead,
   TableHeader,
   TableRow,
 } from "@/components/ui/table";
 import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogFooter,
   DialogHeader,
   DialogTitle,
   DialogTrigger,
 } from "@/components/ui/dialog";
 import {
   DropdownMenu,
   DropdownMenuContent,
   DropdownMenuItem,
   DropdownMenuTrigger,
 } from "@/components/ui/dropdown-menu";
 import { Input } from "@/components/ui/input";
 import { Label } from "@/components/ui/label";
 import { Badge } from "@/components/ui/badge";
 import { useToast } from "@/components/ui/use-toast";
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
} from "@/features/categories/categoriesApi";
 import type { ICategory } from "@/types/category.type";
 
 const categorySchema = z.object({
   name: z.string().min(2, "Name must be at least 2 characters"),
   description: z.string().optional(),
 });
 
 type CategoryFormData = z.infer<typeof categorySchema>;
 
 export default function CategoriesPage() {
   const { toast } = useToast();
   const [isCreateOpen, setIsCreateOpen] = useState(false);
   const [isEditOpen, setIsEditOpen] = useState(false);
   const [isDeleteOpen, setIsDeleteOpen] = useState(false);
   const [selectedCategory, setSelectedCategory] = useState<ICategory | null>(
     null,
   );
 
   const { data: categoriesData, isLoading, error } = useGetCategoriesQuery();
   const [createCategory, { isLoading: isCreating }] =
     useCreateCategoryMutation();
   const [updateCategory, { isLoading: isUpdating }] =
     useUpdateCategoryMutation();
   const [deleteCategory, { isLoading: isDeleting }] =
     useDeleteCategoryMutation();
 
   const createForm = useForm<CategoryFormData>({
     resolver: zodResolver(categorySchema),
     defaultValues: {
       name: "",
       description: "",
     },
   });
 
   const editForm = useForm<CategoryFormData>({
     resolver: zodResolver(categorySchema),
     defaultValues: {
       name: "",
       description: "",
     },
   });
 
   const categoriesDataNormalized =
     (categoriesData as { data?: ICategory[] } | ICategory[] | null) ?? null;
   const categories: ICategory[] = Array.isArray(categoriesDataNormalized)
     ? categoriesDataNormalized
     : Array.isArray(categoriesDataNormalized?.data)
       ? categoriesDataNormalized.data!
       : [];
 
   const handleCreateCategory = async (data: CategoryFormData) => {
     try {
       await createCategory({ name: data.name }).unwrap();
       toast({
         title: "Category created",
         description: "The category has been created successfully.",
         variant: "success",
       });
       setIsCreateOpen(false);
       createForm.reset();
     } catch (error) {
       toast({
         title: "Error",
         description: "Failed to create category. Please try again.",
         variant: "destructive",
       });
     }
   };
 
   const handleEditCategory = (category: ICategory) => {
     setSelectedCategory(category);
     editForm.reset({
       name: category.name,
       description: category.description || "",
     });
     setIsEditOpen(true);
   };
 
   const handleUpdateCategory = async (data: CategoryFormData) => {
     if (!selectedCategory) return;
 
     try {
       await updateCategory({
         id: selectedCategory.id,
         body: { name: data.name },
       }).unwrap();
       toast({
         title: "Category updated",
         description: "The category has been updated successfully.",
         variant: "success",
       });
       setIsEditOpen(false);
       setSelectedCategory(null);
       editForm.reset();
     } catch (error) {
       toast({
         title: "Error",
         description: "Failed to update category. Please try again.",
         variant: "destructive",
       });
     }
   };
 
   const handleDeleteCategory = async () => {
     if (!selectedCategory) return;
 
     try {
       await deleteCategory({ id: selectedCategory.id }).unwrap();
       toast({
         title: "Category deleted",
         description: "The category has been deleted successfully.",
         variant: "success",
       });
       setIsDeleteOpen(false);
       setSelectedCategory(null);
     } catch (error) {
       toast({
         title: "Error",
         description: "Failed to delete category. Please try again.",
         variant: "destructive",
       });
     }
   };
 
   const confirmDelete = (category: ICategory) => {
     setSelectedCategory(category);
     setIsDeleteOpen(true);
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
             <CardDescription>
               Failed to load categories. Please try again later.
             </CardDescription>
           </CardHeader>
         </Card>
       </div>
     );
   }
 
   return (
     <div className="space-y-6">
       <div className="flex items-center justify-between">
         <div>
           <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
           <p className="text-muted-foreground">Manage your course categories</p>
         </div>
 
         <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
           <DialogTrigger asChild>
             <Button>
               <Plus className="mr-2 h-4 w-4" />
               Add Category
             </Button>
           </DialogTrigger>
           <DialogContent>
             <DialogHeader>
               <DialogTitle>Create Category</DialogTitle>
               <DialogDescription>
                 Add a new category for your courses.
               </DialogDescription>
             </DialogHeader>
             <form onSubmit={createForm.handleSubmit(handleCreateCategory)}>
               <div className="grid gap-4 py-4">
                 <div className="grid gap-2">
                   <Label htmlFor="name">Name</Label>
                   <Input
                     id="name"
                     placeholder="e.g., Web Development"
                     {...createForm.register("name")}
                   />
                   {createForm.formState.errors.name && (
                     <p className="text-sm text-destructive">
                       {createForm.formState.errors.name.message}
                     </p>
                   )}
                 </div>
                 <div className="grid gap-2">
                   <Label htmlFor="description">Description (Optional)</Label>
                   <Input
                     id="description"
                     placeholder="Brief description"
                     {...createForm.register("description")}
                   />
                 </div>
               </div>
               <DialogFooter>
                 <Button
                   type="button"
                   variant="outline"
                   onClick={() => setIsCreateOpen(false)}
                 >
                   Cancel
                 </Button>
                 <Button type="submit" disabled={isCreating}>
                   {isCreating && (
                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                   )}
                   Create
                 </Button>
               </DialogFooter>
             </form>
           </DialogContent>
         </Dialog>
       </div>
 
       <Card>
         <CardHeader>
           <CardTitle>All Categories</CardTitle>
           <CardDescription>
             {categories.length} category(categories) found
           </CardDescription>
         </CardHeader>
         <CardContent>
           {categories.length === 0 ? (
             <div className="flex flex-col items-center justify-center py-12 text-center">
               <p className="text-muted-foreground">No categories found</p>
               <Button
                 variant="link"
                 onClick={() => setIsCreateOpen(true)}
                 className="mt-2"
               >
                 Create your first category
               </Button>
             </div>
           ) : (
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Name</TableHead>
                   <TableHead>Slug</TableHead>
                   <TableHead>Status</TableHead>
                   <TableHead className="text-right">Actions</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {categories.map((category) => (
                   <TableRow key={category.id}>
                     <TableCell className="font-medium">
                       {category.name}
                     </TableCell>
                     <TableCell>
                       <Badge variant="secondary">{category.slug}</Badge>
                     </TableCell>
                     <TableCell>
                       <Badge variant="outline">Active</Badge>
                     </TableCell>
                     <TableCell className="text-right">
                       <DropdownMenu>
                         <DropdownMenuTrigger asChild>
                           <Button variant="ghost" size="sm">
                             Actions
                           </Button>
                         </DropdownMenuTrigger>
                         <DropdownMenuContent align="end">
                           <DropdownMenuItem
                             onClick={() => handleEditCategory(category)}
                           >
                             <Pencil className="mr-2 h-4 w-4" />
                             Edit
                           </DropdownMenuItem>
                           <DropdownMenuItem
                             onClick={() => confirmDelete(category)}
                             className="text-destructive"
                           >
                             <Trash2 className="mr-2 h-4 w-4" />
                             Delete
                           </DropdownMenuItem>
                         </DropdownMenuContent>
                       </DropdownMenu>
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           )}
         </CardContent>
       </Card>
 
       {/* Edit Dialog */}
       <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Edit Category</DialogTitle>
             <DialogDescription>Update the category details.</DialogDescription>
           </DialogHeader>
           <form onSubmit={editForm.handleSubmit(handleUpdateCategory)}>
             <div className="grid gap-4 py-4">
               <div className="grid gap-2">
                 <Label htmlFor="edit-name">Name</Label>
                 <Input
                   id="edit-name"
                   placeholder="e.g., Web Development"
                   {...editForm.register("name")}
                 />
                 {editForm.formState.errors.name && (
                   <p className="text-sm text-destructive">
                     {editForm.formState.errors.name.message}
                   </p>
                 )}
               </div>
               <div className="grid gap-2">
                 <Label htmlFor="edit-description">Description (Optional)</Label>
                 <Input
                   id="edit-description"
                   placeholder="Brief description"
                   {...editForm.register("description")}
                 />
               </div>
             </div>
             <DialogFooter>
               <Button
                 type="button"
                 variant="outline"
                 onClick={() => setIsEditOpen(false)}
               >
                 Cancel
               </Button>
               <Button type="submit" disabled={isUpdating}>
                 {isUpdating && (
                   <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                 )}
                 Save Changes
               </Button>
             </DialogFooter>
           </form>
         </DialogContent>
       </Dialog>
 
       {/* Delete Confirmation Dialog */}
       <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Delete Category</DialogTitle>
             <DialogDescription>
               Are you sure you want to delete the category &quot;{selectedCategory?.name}&quot;? This action cannot be undone.
             </DialogDescription>
           </DialogHeader>
           <DialogFooter>
             <Button
               type="button"
               variant="outline"
               onClick={() => setIsDeleteOpen(false)}
             >
               Cancel
             </Button>
             <Button
               variant="destructive"
               onClick={handleDeleteCategory}
               disabled={isDeleting}
             >
               {isDeleting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
               Delete
             </Button>
           </DialogFooter>
         </DialogContent>
       </Dialog>
     </div>
   );
 }
