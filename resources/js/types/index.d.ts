import { LucideIcon } from 'lucide-react';
import type { Config } from 'ziggy-js';

export interface Auth {
    user: User;
}

export interface BreadcrumbItem {
    title: string;
    href: string;
}

export interface NavGroup {
    title: string;
    items: NavItem[];
}

export interface NavItem {
    title: string;
    href: string;
    icon?: LucideIcon | null;
    isActive?: boolean;
}

export interface SharedData {
    name: string;
    quote: { message: string; author: string };
    auth: Auth;
    ziggy: Config & { location: string };
    sidebarOpen: boolean;
    flash: {
        success: unknown | null;
        error: unknown | null;
        message: unknown | null;
    };
    [key: string]: unknown;
}

export interface User {
    id: number;
    name: string;
    email: string;
    avatar?: string;
    role: string;
    email_verified_at: string | null;
    created_at: string;
    updated_at: string;
    [key: string]: unknown; // This allows for additional properties...
}
export interface Category {
    id: number;
    name: string;
    posts_count: number;
}

export interface PaginatedResponse<T = unknown> {
    current_page: number;
    data: T[];
    first_page_url: string;
    from: number;
    last_page: number;
    last_page_url: string;
    links: {
        url: string | null;
        label: string;
        active: boolean;
    }[];
    next_page_url: string | null;
    path: string;
    per_page: number;
    prev_page_url: string | null;
    to: number;
    total: number;
}

export interface TablePaginationProps {
    resource: PaginatedResponse;
    noItemsText?: string;
    singlePageText?: string;
}

export interface Post {
    id: number;
    title: string;
    slug: string;
    content: string;
    category_id: number;
    user_id: number;
    category: Category;
    published_at: string | null;
    comments: Comment[];
    comments_count: number;
}

export interface Comment {
    id: number;
    content: string;
    user: User;
    created_at: string;
}
