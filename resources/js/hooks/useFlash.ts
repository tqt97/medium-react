import type { SharedData } from '@/types';
import { usePage } from '@inertiajs/react';

export function useFlash() {
    const page = usePage<SharedData>();
    return page.props.flash;
}
