import { useState, useCallback } from "react";

export const usePagination = (initialPage = 1) => {
    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);

    const prevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [ totalPages ]);

    return {
        currentPage,
        totalPages, setTotalPages,
        prevPage, nextPage
    };
};
