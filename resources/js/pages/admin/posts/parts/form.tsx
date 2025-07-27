import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, Post } from '@/types';
import { formatDatetimeLocal } from '@/utils/datetime';
import { LoaderCircle } from 'lucide-react';

interface PostFormProps {
    open: boolean;
    editPost: Post | null;
    categories: Category[];
    data: Record<string, string>;
    onClose(): void;
    onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void;
    onSelectChange(name: string, value: string): void;
    onSubmit(e: React.FormEvent): void;
    processing: boolean;
    errors: Record<string, string>;
}

export default function PostFormModal({
    open,
    editPost,
    categories,
    data,
    onClose,
    onChange,
    onSelectChange,
    onSubmit,
    processing,
    errors,
}: PostFormProps) {
    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="w-full max-w-[800px] sm:max-w-[1400px]">
                <DialogHeader>
                    <DialogTitle>{editPost ? 'Edit Post' : 'Add New Post'}</DialogTitle>
                    <DialogDescription>{editPost ? 'Make changes to your blog post here.' : 'Create a new blog post here.'}</DialogDescription>
                </DialogHeader>
                <form onSubmit={onSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" name="title" value={data.title} onChange={onChange} required />
                        <InputError message={errors.title} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="content">Content</Label>
                        <Textarea id="content" name="content" value={data.content} onChange={onChange} className="min-h-[200px]" />
                        <InputError message={errors.content} />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Select value={data.category_id} onValueChange={(value) => onSelectChange('category_id', value)}>
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
                            value={formatDatetimeLocal(data.published_at, 'yyyy-MM-ddTHH:mm')}
                            onChange={onChange}
                        />
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} className="cursor-pointer" disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing} className="cursor-pointer">
                            {processing && <LoaderCircle className="h-4 w-4 animate-spin" />}
                            {editPost ? 'Update' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
