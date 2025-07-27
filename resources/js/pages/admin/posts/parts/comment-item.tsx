import { Comment } from '@/types';
import { formatDatetimeLocal } from '@/utils/datetime';
import clsx from 'clsx';

export function CommentItem({ comment, isLast }: { comment: Comment; isLast?: boolean }) {
    return (
        <div className="group flex gap-x-6">
            <div className="relative">
                <div className="absolute top-0 left-1/2 h-full w-0.5 -translate-x-1/2 bg-slate-200"></div>
                <span className="relative z-10 grid h-2 w-2 place-items-center rounded-full bg-slate-200 text-slate-800"></span>
            </div>
            <div className={clsx('-translate-y-1.5 text-slate-600', isLast ? 'pb-0' : 'pb-4')}>
                <time className="mb-1 text-xs leading-none font-normal text-gray-500 dark:text-gray-500">
                    {formatDatetimeLocal(comment.created_at, 'yyyy-MM-dd HH:mm')}
                </time>
                <p className="font-sans text-base font-bold text-slate-800 antialiased dark:text-white">{comment.user.name}</p>
                <small className="mt-2 font-sans text-sm text-slate-600 antialiased">{comment.content}</small>
            </div>
        </div>
    );
}
