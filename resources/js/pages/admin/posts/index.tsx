import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import AppLayout from '@/layouts/app-layout';
import { Category, PaginatedResponse, Post, type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast, Toaster } from 'sonner';

interface PostsPageProps {
    posts: PaginatedResponse<Post>;
    categories: Category[];
}

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Posts',
        href: '/admin/posts',
    },
];

export default function PostsPage({ posts, categories }: PostsPageProps) {
    const [showModal, setShowModal] = useState(false);
    const [showCommentsModal, setShowCommentsModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState<Post | null>(null);
    const [editPost, setEditPost] = useState<Post | null>(null);
    const auth = useAuth();
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        category_id: '',
        published_at: '',
    });

    const handleAdd = () => {
        setEditPost(null);
        setFormData({
            title: '',
            content: '',
            category_id: '',
            published_at: '',
        });
        setShowModal(true);
    };

    const handleEdit = (post: Post) => {
        setEditPost(post);
        setFormData({
            title: post.title,
            content: post.content,
            category_id: post.category_id.toString(),
            published_at: post.published_at || '',
        });
        setShowModal(true);
    };

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this post?')) {
            router.delete(`/admin/posts/${id}`, {
                onSuccess: () => {
                    toast.success('Post deleted successfully', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Failed to delete post', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (editPost) {
            router.put(`/admin/posts/${editPost.id}`, formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Post updated successfully', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Failed to update post', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
            });
        } else {
            router.post('/admin/posts', formData, {
                onSuccess: () => {
                    setShowModal(false);
                    toast.success('Post created successfully', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
                onError: () => {
                    toast.error('Failed to create post', {
                        duration: 3000,
                        position: 'top-right',
                    });
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleShowComments = (post: Post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <Toaster richColors closeButton />
            <div className="flex flex-col gap-4 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Posts</h1>{' '}
                    <Button onClick={handleAdd} className="cursor-pointer">
                        Add Blog
                    </Button>
                </div>
                <div className="rounded-md border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Category</TableHead>
                                <TableHead>Published At</TableHead>
                                <TableHead>Comments</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {posts.data.map((post: Post) => (
                                <TableRow key={post.id}>
                                    <TableCell>{post.title}</TableCell>
                                    <TableCell>{post.category?.name}</TableCell>
                                    <TableCell>{post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => handleShowComments(post)}
                                            className="cursor-pointer text-blue-600 hover:text-blue-800"
                                        >
                                            {post.comments_count} {post.comments_count > 1 ? 'comments' : 'comment'}
                                        </Button>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex gap-2">
                                            <Button variant="outline" size="sm" onClick={() => handleEdit(post)} className="cursor-pointer">
                                                Edit
                                            </Button>
                                            <Button
                                                variant="destructive"
                                                size="sm"
                                                onClick={() => handleDelete(post.id)}
                                                className="cursor-pointer"
                                                disabled={post.user_id !== auth.user?.id && !auth.user?.role.includes('admin')}
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
                    <TablePagination resource={posts} />
                </div>
                {/* Comments Modal */}
                <Dialog open={showCommentsModal} onOpenChange={setShowCommentsModal}>
                    <DialogContent className="w-full max-w-[800px] sm:max-w-[800px]">
                        <DialogHeader>
                            <DialogTitle>Comments for {selectedPost?.title}</DialogTitle>
                            <DialogDescription>View all comments on this Post </DialogDescription>
                        </DialogHeader>
                        <div className="max-h-[400px] overflow-y-auto">
                            {selectedPost?.comments.map((comment) => (
                                <div key={comment.id} className="border-b py-3 last:border-b-0">
                                    <div className="mb-2 flex items-start justify-between">
                                        <div className="font-medium">{comment.user.name}</div>
                                        <div className="text-sm text-gray-500">{new Date(comment.created_at).toLocaleDateString()}</div>
                                    </div>
                                    <p className="text-sm text-gray-700">{comment.content}</p>
                                </div>
                            ))}
                            {selectedPost?.comments.length === 0 && <div className="py-4 text-center text-gray-500">No comments yet </div>}
                        </div>
                    </DialogContent>
                </Dialog>
                <Dialog open={showModal} onOpenChange={setShowModal}>
                    <DialogContent className="w-full max-w-[800px] sm:max-w-[1400px]">
                        <DialogHeader>
                            <DialogTitle>{editPost ? 'Edit Blog' : 'Add New Blog'}</DialogTitle>
                            <DialogDescription>
                                {editPost ? 'Make changes to your blog post here.' : 'Create a new blog post here.'}
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" value={formData.title} onChange={handleInputChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="content">Content</Label>
                                <Textarea
                                    id="content"
                                    name="content"
                                    value={formData.content}
                                    onChange={handleInputChange}
                                    required
                                    className="min-h-[200px]"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="category">Category</Label>
                                <Select value={formData.category_id} onValueChange={(value) => handleSelectChange('category_id', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {categories.map((category) => (
                                            <SelectItem key={category.id} value={category.id.toString()}>
                                                {category.name}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="published_at">Published At</Label>
                                <Input
                                    id="published_at"
                                    name="published_at"
                                    type="datetime-local"
                                    value={formData.published_at}
                                    onChange={handleInputChange}
                                />
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setShowModal(false)} className="cursor-pointer">
                                    Cancel
                                </Button>
                                <Button type="submit" className="cursor-pointer">
                                    {editPost ? 'Update' : 'Create'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>
        </AppLayout>
    );
}
