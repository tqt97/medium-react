import { Pagination, PaginationContent, PaginationItem, PaginationNext, PaginationPrevious } from '@/components/ui/pagination';
import { TablePaginationProps } from '@/types';
import { generatePaginationLinks } from '@/lib/generate-pagination-links';

export function TablePagination({
    resource,
    noItemsText = 'No items found',
    singlePageText = ''
}: TablePaginationProps) {
    if (resource.total === 0) {
        return (
            <div className='mt-4 text-center text-gray-500'>
                {noItemsText}
            </div>
        );
    }

    if (resource.last_page === 1) {
        return singlePageText ? (
            <div className='mt-4 text-center text-gray-500'>
                {singlePageText}
            </div>
        ) : null;
    }

    return (
        <Pagination className='mt-4'>
            <PaginationContent>
                <PaginationItem>
                    {resource.prev_page_url ? (
                        <PaginationPrevious
                            href={resource.prev_page_url}
                            preserveScroll
                            preserveState
                        />
                    ) : null}
                </PaginationItem>

                {generatePaginationLinks(
                    resource.current_page,
                    resource.last_page,
                    resource.path
                )}

                <PaginationItem>
                    {resource.next_page_url ? (
                        <PaginationNext
                            href={resource.next_page_url}
                            preserveScroll
                            preserveState
                        />
                    ) : null}
                </PaginationItem>
            </PaginationContent>
        </Pagination>
    );
}
