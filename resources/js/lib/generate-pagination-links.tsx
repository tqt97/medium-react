import { PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { JSX } from 'react';

export const generatePaginationLinks = (currentPage: number, totalPages: number, path: string, pageQuery: string = 'page') => {
    const pages: JSX.Element[] = [];
    const normalizedPage = Math.max(1, Math.min(currentPage, totalPages));
    const separator = path.includes('?') ? '&' : '?';
    const maxPageEllipsis = 12;

    if (totalPages <= maxPageEllipsis) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <PaginationItem key={`page-${i}`}>
                    <PaginationLink
                        href={`${path}${separator}${pageQuery}=${i}`}
                        isActive={i === normalizedPage}
                        preserveScroll
                        preserveState
                        prefetch
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }
    } else {
        // Show first two pages
        for (let i = 1; i <= 2; i++) {
            pages.push(
                <PaginationItem key={`page-${i}`}>
                    <PaginationLink
                        href={`${path}${separator}${pageQuery}=${i}`}
                        isActive={i === normalizedPage}
                        preserveScroll
                        preserveState
                        prefetch
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        // Show ellipsis and current page if needed
        if (normalizedPage > 3 && normalizedPage < totalPages - 1) {
            pages.push(<PaginationEllipsis key="ellipsis-start" />);
            pages.push(
                <PaginationItem key={`page-${normalizedPage}`}>
                    <PaginationLink href={`${path}${separator}${pageQuery}=${normalizedPage}`} isActive={true} preserveScroll preserveState prefetch>
                        {normalizedPage}
                    </PaginationLink>
                </PaginationItem>,
            );
        }

        // Show end ellipsis and last two pages
        if (totalPages > 3) {
            pages.push(<PaginationEllipsis key="ellipsis-end" />);
        }
        for (let i = totalPages - 1; i <= totalPages; i++) {
            pages.push(
                <PaginationItem key={`page-${i}`}>
                    <PaginationLink
                        href={`${path}${separator}${pageQuery}=${i}`}
                        isActive={i === normalizedPage}
                        preserveScroll
                        preserveState
                        prefetch
                    >
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }
    }
    return pages;
};
