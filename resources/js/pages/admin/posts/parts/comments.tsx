import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Post } from '@/types';
import { Virtuoso } from 'react-virtuoso';
import { CommentItem } from './comment-item';

export default function CommentsModal({ open, onOpenChange, post }: { open: boolean; onOpenChange(open: boolean): void; post: Post | null }) {
    const comments = post?.comments ?? [];

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Comments for {post?.title}</DialogTitle>
                    <DialogDescription>All comments on this post.</DialogDescription>
                </DialogHeader>
                <div className="max-h-80 overflow-auto">
                    {comments.length > 0 ? (
                        <Virtuoso
                            style={{ height: '320px' }}
                            data={comments}
                            itemContent={(index, comment) => <CommentItem comment={comment} isLast={index === comments.length - 1} />}
                        />
                    ) : (
                        <p className="text-center text-gray-500">No comments yet</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
