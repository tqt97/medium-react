import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { type Post } from '@/types';
import { formatDatetimeLocal } from '@/utils/datetime';
import clsx from 'clsx';

export default function CommentsModal({ open, onOpenChange, post }: { open: boolean; onOpenChange(open: boolean): void; post: Post | null }) {
    const commentsLength = post?.comments.length;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-full sm:max-w-5xl">
                <DialogHeader>
                    <DialogTitle>Comments for {post?.title}</DialogTitle>
                    <DialogDescription>All comments on this post.</DialogDescription>
                </DialogHeader>
                <div className="max-h-80 overflow-auto">
                    {commentsLength ? (
                        post.comments.map((c, idx) => (
                            <div key={c.id} className="group flex gap-x-6">
                                <div className="relative">
                                    <div className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-slate-200"></div>
                                    <span className="relative z-10 grid h-2 w-2 place-items-center rounded-full bg-slate-200 text-slate-800"></span>
                                </div>
                                <div className={clsx('-translate-y-1.5 text-slate-600', idx === commentsLength - 1 ? 'pb-0' : 'pb-4')}>
                                    <time className="mb-1 text-xs leading-none font-normal text-gray-500 dark:text-gray-500">
                                        {formatDatetimeLocal(c.created_at, 'yyyy-MM-dd HH:mm')}
                                    </time>
                                    <p className="font-sans text-base font-bold text-slate-800 antialiased dark:text-white">{c.user.name}</p>
                                    <small className="mt-2 font-sans text-sm text-slate-600 antialiased">{c.content}</small>
                                </div>
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
