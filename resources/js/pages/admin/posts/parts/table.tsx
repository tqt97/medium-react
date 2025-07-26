// ./parts/PostTableRow.tsx
import { Button } from '@/components/ui/button';
import { TableCell, TableRow } from '@/components/ui/table';
import { useAuth } from '@/hooks/useAuth';
import { Post } from '@/types';

interface PostTableRowProps {
    post: Post;
    onEdit: (post: Post) => void;
    onDelete: (post: Post) => void;
    onShowComments: (post: Post) => void;
    isHighlighted?: boolean;
}

export default function PostTableRow({ post, onEdit, onDelete, onShowComments, isHighlighted = false }: PostTableRowProps) {
    const auth = useAuth();
    const canDelete = post.user_id === auth.user?.id || auth.user?.role.includes('admin');
    const canEdit = post.user_id === auth.user?.id || auth.user?.role.includes('admin');

    return (
        <TableRow key={post.id} className={isHighlighted ? 'bg-green-50 transition-colors duration-500' : ''}>
            <TableCell>{post.title}</TableCell>
            <TableCell>{post.category?.name}</TableCell>
            <TableCell>{post.published_at ? new Date(post.published_at).toLocaleDateString() : '-'}</TableCell>
            <TableCell>
                <Button variant="ghost" size="sm" onClick={() => onShowComments(post)} className="cursor-pointer text-blue-600 hover:text-blue-800">
                    {post.comments_count} {post.comments_count > 1 ? 'comments' : 'comment'}
                </Button>
            </TableCell>
            <TableCell>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => onEdit(post)} className="cursor-pointer" disabled={!canEdit}>
                        Edit
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => onDelete(post)} className="cursor-pointer" disabled={!canDelete}>
                        Delete
                    </Button>
                </div>
            </TableCell>
        </TableRow>
    );
}
