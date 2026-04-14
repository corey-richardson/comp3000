import { useCallback, useEffect, useRef, useState } from "react";

/**
 * This hook manages local pagination state.
 * * Handles page navigation, total count tracking, and resets the current page to the
 * first page whenenever the items per page value (`loadNumber`) changes.
 * @param {number} [initialPage = 1]
 * @returns {number} currentPage The currently active page
 * @returns {number} totalPages The total number of pages available
 * @returns {Function} setTotalPages Setter method for totalPages
 * @returns {number} totalCount The total number of items across pages
 * @returns {Function} setTotalCount Setter method for totalCount
 * @returns {number} loadNumber The number of items to load per page
 * @returns {Function} setLoadNumber Setter method for loadNumber
 * @returns {Function} prevPage : Decrements the current page (clamped to 1)
 * @returns {Function} nextPage : Increments the current page (clamped to totalPages`)
 * * @example
 * const { currentPage, nextPage, setTotalPages } = usePagination();
 * const paginationProps = usePagination(1);
 */
export const usePagination = (initialPage = 1) => {
    const [ currentPage, setCurrentPage ] = useState(initialPage);
    const [ totalPages, setTotalPages ] = useState(1);
    const [ totalCount, setTotalCount ] = useState(0);
    const [ loadNumber, setLoadNumber ] = useState(25);

    const prevPage = useCallback(() => {
        setCurrentPage((prev) => Math.max(prev - 1, 1));
    }, []);

    const nextPage = useCallback(() => {
        setCurrentPage((prev) => Math.min(prev + 1, totalPages));
    }, [ totalPages ]);

    // Reset to first page when items per page value (loadNumber) is changed
    // useRef flag avoids race condition where currentPage is reset to 1 on mount, ignoring
    // the value passed in as a parameter.
    const isFirstRender = useRef(true);
    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }

        setCurrentPage(1);
    }, [ loadNumber ]);

    return {
        currentPage,
        totalPages, setTotalPages,
        totalCount, setTotalCount,
        loadNumber, setLoadNumber,
        prevPage, nextPage
    };
};
