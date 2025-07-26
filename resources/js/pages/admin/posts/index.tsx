import { ConfirmDialog } from '@/components/confirm-dialog';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { TablePagination } from '@/components/ui/table-pagination';
import AppLayout from '@/layouts/app-layout';
import { Category, PaginatedResponse, Post, type BreadcrumbItem } from '@/types';
import { notify } from '@/utils/notify';
import { Head, useForm } from '@inertiajs/react';
import { useState } from 'react';
import CommentsModal from './parts/comments';
import PostFormModal from './parts/form';
import PostTableRow from './parts/table';

interface PostsPageProps {
    posts: PaginatedResponse<Post>;
    categories: Category[];
}

interface FormData {
    title: string;
    content: string;
    category_id: string;
    published_at: string;
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
        errors,
    } = useForm<Required<FormData>>({
        title: '',
        content: '',
        category_id: '',
        published_at: '',
    });

    const handleOpenForm = (post?: Post) => {
        setEditPost(post ?? null);
        setData({
            title: post?.title || '',
            content: post?.content || '',
            category_id: post?.category_id?.toString() || '',
            published_at: post?.published_at || '',
        });
        setShowModal(true);
    };

    const confirmDelete = () => {
        if (deleteConfirm.id) {
            destroy(`/admin/posts/${deleteConfirm.id}`, {
                onSuccess: () => {
                    setDeleteConfirm({ show: false, id: undefined });
                    reset();
                    notify('success', 'Post deleted successfully');
                },
                onError: (errors) => {
                    setDeleteConfirm({ show: false, id: undefined });
                    notify('error', errors.error || 'Failed to delete post');
                },
            });
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (processing) return;

        const urlParams = new URLSearchParams(window.location.search);
        const currentPage = urlParams.get('page');
        if (editPost) {
            let url = `/admin/posts/${editPost.id}`;
            if (currentPage) {
                url = url + `?page=${currentPage}`;
            }
            put(url, {
                onSuccess: () => {
                    setRecentlyUpdatedId(editPost.id);
                    setShowModal(false);
                    reset();
                    notify('success', 'Post updated successfully');

                    setTimeout(() => setRecentlyUpdatedId(null), 3000);
                },
                onError: () => {
                    notify('error', 'Failed to update post');
                },
            });
        } else {
            post('/admin/posts', {
                onSuccess: () => {
                    setShowModal(false);
                    reset();
                    notify('success', 'Post created successfully');
                },
                onError: () => {
                    notify('error', 'Failed to create post');
                },
            });
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSelectChange = (name: string, value: string) => {
        setData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleShowComments = (post: Post) => {
        setSelectedPost(post);
        setShowCommentsModal(true);
    };

    const handleDelete = (post: Post) => {
        setDeleteConfirm({ show: true, id: post.id });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Posts" />
            <div className="flex flex-col gap-4 p-4">
                <div className="mb-4 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Posts</h1>
                    <Button onClick={() => handleOpenForm()} className="cursor-pointer">
                        Add Post
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
                                <PostTableRow
                                    key={post.id}
                                    post={post}
                                    onEdit={handleOpenForm}
                                    onDelete={handleDelete}
                                    onShowComments={handleShowComments}
                                    isHighlighted={post.id === recentlyUpdatedId}
                                />
                            ))}
                        </TableBody>
                    </Table>
                </div>

                {/* Pagination */}
                <div className="flex-end mt-4 flex justify-end">
                    <TablePagination resource={posts} />
                </div>

                {/* Comments Modal */}
                <CommentsModal open={showCommentsModal} onOpenChange={setShowCommentsModal} post={selectedPost} />

                {/* Form Modal */}
                <PostFormModal
                    open={showModal}
                    editPost={editPost}
                    categories={categories}
                    data={data}
                    onChange={handleInputChange}
                    onSelectChange={handleSelectChange}
                    onSubmit={handleSubmit}
                    onClose={() => setShowModal(false)}
                    processing={processing}
                    errors={errors}
                />

                {/* Delete confirm dialog */}
                <ConfirmDialog
                    open={deleteConfirm.show}
                    onOpenChange={(open) => setDeleteConfirm({ show: open, id: undefined })}
                    onConfirm={confirmDelete}
                    loading={processing}
                    title="Confirm Deletion"
                    description="Are you sure you want to delete this post? This action cannot be undone."
                    confirmLabel="Delete"
                    confirmVariant="destructive"
                />
            </div>
        </AppLayout>
    );
}
