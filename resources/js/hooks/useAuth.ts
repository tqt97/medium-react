import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useAuth() {
    const page = usePage<SharedData>();
    return page.props.auth;
}
