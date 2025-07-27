import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/useAuth';
import { type NavItem } from '@/types';
import { Link } from '@inertiajs/react';
import { FolderPlus, PenSquare } from 'lucide-react';
import AppLogo from './app-logo';

const adminNav: NavItem[] = [
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderPlus,
    },
    {
        title: 'Posts',
        href: '/admin/posts',
        icon: PenSquare,
    },
];

const userNav: NavItem[] = [
    {
        title: 'Categories',
        href: '/admin/categories',
        icon: FolderPlus,
    },
    {
        title: 'Posts',
        href: '/admin/posts',
        icon: PenSquare,
    },
];

// const footerNavItems: NavItem[] = [
//     {
//         title: 'Repository',
//         href: 'https://github.com/laravel/react-starter-kit',
//         icon: Folder,
//     },
//     {
//         title: 'Documentation',
//         href: 'https://laravel.com/docs/starter-kits#react',
//         icon: BookOpen,
//     },
// ];

export function AppSidebar() {
    const { user } = useAuth();
    const mainNavItems: NavItem[] = user?.role === 'admin' ? adminNav : userNav;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href="/dashboard" prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                {/* <NavFooter items={footerNavItems} className="mt-auto" /> */}
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
