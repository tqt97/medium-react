import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Post } from '@/types';

export default function CommentsModal({ open, onOpenChange, post }: { open: boolean; onOpenChange(open: boolean): void; post: Post | null }) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>Comments for {post?.title}</DialogTitle>
                    <DialogDescription>All comments on this post.</DialogDescription>
                </DialogHeader>
                <div className="max-h-80 space-y-3 overflow-auto">
                    {post?.comments.length ? (
                        post.comments.map((c) => (
                            <div key={c.id} className="border-b pb-2">
                                <div className="font-medium">{c.user.name}</div>
                                <p className="text-sm text-gray-700">{c.content}</p>
                            </div>
                        ))
                    ) : (
                        <p className="text-center text-gray-500">No comments yet</p>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
