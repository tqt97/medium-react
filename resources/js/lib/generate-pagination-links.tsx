import { PaginationEllipsis, PaginationItem, PaginationLink } from '@/components/ui/pagination';
import { JSX } from 'react';

export const generatePaginationLinks = (currentPage: number, totalPages: number, path: string, pageQuery: string = '?page=') => {
    const pages: JSX.Element[] = [];
    if (totalPages <= 6) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink href={path + pageQuery + i} isActive={i === currentPage} preserveScroll preserveState prefetch>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }
    } else {
        for (let i = 1; i <= 2; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink href={path + pageQuery + i} isActive={i === currentPage} preserveScroll preserveState prefetch>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }
        if (currentPage > 2 && currentPage < totalPages - 1) {
            pages.push(<PaginationEllipsis key="ellipsis-before" />);
            pages.push(
                <PaginationItem key={currentPage}>
                    <PaginationLink href="" isActive={true} preserveScroll preserveState prefetch>
                        {currentPage}
                    </PaginationLink>
                </PaginationItem>,
            );
        }
        pages.push(<PaginationEllipsis key="ellipsis-after" />);
        for (let i = totalPages - 1; i <= totalPages; i++) {
            pages.push(
                <PaginationItem key={i}>
                    <PaginationLink href={path + pageQuery + i} isActive={i === currentPage} preserveScroll preserveState prefetch>
                        {i}
                    </PaginationLink>
                </PaginationItem>,
            );
        }
    }
    return pages;
};
