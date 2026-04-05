import { useState, useCallback } from "react";

export const usePagination = (initialPage = 1) => {
    const [ currentPage, setCurrentPage ] = useState(initialPage);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ totalCount, setTotalCount ] = useState(0);

    const prevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [ totalPages ]);

    return {
        currentPage,
        totalPages, setTotalPages,
        totalCount, setTotalCount,
        prevPage, nextPage
    };
};
