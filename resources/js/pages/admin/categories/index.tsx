import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import AppLayout from '@/layouts/app-layout';
import { Category, PaginatedResponse, type BreadcrumbItem } from '@/types';
import { notify } from '@/utils/notify';
import { Head, useForm } from '@inertiajs/react';
import { LoaderCircle, Plus } from 'lucide-react';
import { useState } from 'react';

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Categories',
        href: '/admin/categories',
    },
];

export default function CategoriesPage({ categories }: { categories: PaginatedResponse<Category> }) {
    const [showModal, setShowModal] = useState(false);
    const [editCategory, setEditCategory] = useState<Category | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<{ show: boolean; id?: number }>({ show: false });
    const [recentlyUpdatedId, setRecentlyUpdatedId] = useState<number | null>(null);
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

    const handleDelete = (category: Category) => {
        if (category.posts_count > 0) {
            notify('warning', 'Category has posts. Can not delete');
            return;
        }
        setDeleteConfirm({ show: true, id: category.id });
    };

    const handleOpenForm = (category?: Category) => {
        setEditCategory(category ?? null);
        reset();
        setData({
            name: category?.name ?? '',
        });
        setShowModal(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;

        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');
        if (editCategory) {
            let url = `/admin/categories/${editCategory.id}`;
            if (currentPage) {
                url = url + `?page=${currentPage}`;
            }

            put(url, {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setRecentlyUpdatedId(editCategory.id);
                    setShowModal(false);
                    reset();
                    notify('success', 'Category updated successfully');
                    setTimeout(() => setRecentlyUpdatedId(null), 3000);
                },
                onError: (errors) => {
                    notify('error', errors.name || 'Failed to update category');
                },
            });
        } else {
            post('/admin/categories', {
                preserveScroll: true,
                preserveState: true,
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    notify('success', 'Category created successfully');
                },
                onError: (errors) => {
                    notify('error', errors.name || 'Failed to create category');
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

    const confirmDelete = () => {
        if (deleteConfirm.id) {
            destroy(`/admin/categories/${deleteConfirm.id}`, {
                onSuccess: () => {
                    setDeleteConfirm({ show: false, id: undefined });
                    reset();
                    notify('success', 'Category deleted successfully');
                },
                onError: (errors) => {
                    setDeleteConfirm({ show: false, id: undefined });
                    notify('error', errors.error || 'Failed to delete category');
                },
            });
        }
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Categories" />
            <div className="flex flex-col gap-4 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Categories</h1>
                    <Button onClick={() => handleOpenForm()} className="cursor-pointer">
                        <Plus className="h-4 w-4" /> Add new
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
                                <TableRow
                                    key={category.id}
                                    className={recentlyUpdatedId === category.id ? 'bg-green-50 transition-colors duration-500' : ''}
                                >
                                    <TableCell>{category.name}</TableCell>
                                    <TableCell className="text-center">{category.posts_count}</TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleOpenForm(category)} className="cursor-pointer">
                                                Edit
                                            </Button>
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <span>
                                                            <Button
                                                                variant="destructive"
                                                                size="sm"
                                                                onClick={() => handleDelete(category)}
                                                                disabled={category.posts_count > 0}
                                                                className="flex cursor-pointer gap-2"
                                                            >
                                                                Delete
                                                            </Button>
                                                        </span>
                                                    </TooltipTrigger>
                                                    {category.posts_count > 0 && (
                                                        <TooltipContent>
                                                            <p>
                                                                Category has {category.posts_count} {category.posts_count > 1 ? 'posts' : 'post'}. Can
                                                                not delete this category!
                                                            </p>
                                                        </TooltipContent>
                                                    )}
                                                </Tooltip>
                                            </TooltipProvider>
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

                {/* Delete confirm dialog */}
                <ConfirmDialog
                    open={deleteConfirm.show}
                    onOpenChange={(open) => setDeleteConfirm({ show: open, id: undefined })}
                    onConfirm={confirmDelete}
                    loading={processing}
                    title="Confirm Deletion"
                    description="Are you sure you want to delete this category? This action cannot be undone."
                    confirmLabel="Delete"
                    confirmVariant="destructive"
                />
            </div>
        </AppLayout>
    );
}
