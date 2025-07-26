import { toast } from 'sonner';

export const notify = (type: 'success' | 'error' | 'warning', message: string) => toast[type](message, { duration: 3000, position: 'top-right' });
