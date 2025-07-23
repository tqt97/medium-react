import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import AppLayout from '@/layouts/app-layout';
import { Category, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { Head, router, useForm } from '@inertiajs/react';
import { LoaderCircle } from 'lucide-react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

export default function CategoriesPage({ categories }: { categories: PaginatedResponse<Category> }) {
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const {
        data,
        setData,
        post,
        put,
        delete: destroy,
        processing,
        reset,
    } = useForm<Required<{ name: string }>>({
        name: '',
    });

    const handleAdd = () => {
        setEditCategory(null);
        setData({ name: '' });
        reset();
        setShowModal(true);
    };

    const handleEdit = (category: Category) => {
        setEditCategory(category);
        setData({ name: category.name });
        reset();
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            destroy(`/admin/categories/${id}`, {
                onSuccess: () => {
                    reset();
                    toast.success('Category deleted successfully');
                },
                onError: (errors) => {
                    toast.error(errors.error || 'Failed to delete category');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editCategory) {
            put(`/admin/categories/${editCategory.id}`, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    toast.success('Category updated successfully');
                    router.visit('/admin/categories', {
                        preserveScroll: true,
                        preserveState: true,
                        only: ['categories'],
                    });
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to update category');
                },
            });
        } else {
            post('/admin/categories', {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    toast.success('Category created successfully');
                },
                onError: (errors) => {
                    toast.error(errors.name || 'Failed to create category');
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData((prev: Required<{ name: string }>) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <Toaster richColors closeButton position="top-right" />
            <div className="flex flex-col gap-4 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button onClick={handleAdd} className="cursor-pointer">
                        Add Category
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-gray-100">
                                <TableHead>Name</TableHead>
                                <TableHead className="text-center">Posts Count</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {categories.data.map((category: Category) => (
                                <TableRow key={category.id}>
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell className="text-center">{category.posts_count}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(category)} className="cursor-pointer">
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(category.id)}
                                                className="cursor-pointer"
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
                {/* Pagination */}
                <div className="flex-end mt-4 flex justify-end">
                    <TablePagination resource={categories} />
                </div>
                {/* Add/Edit Category Modal */}
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle>{editCategory ? 'Edit Category' : 'Add Category'}</DialogTitle>
                            <DialogDescription>
                                {editCategory ? 'Make changes to your category here.' : 'Create a new category here.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="name">Name</Label>
                                <Input id="name" name="name" value={data.name} onChange={handleInputChange} required />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="cursor-pointer">
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing} className="cursor-pointer">
                                    {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                                    {editCategory ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
