import { useState, useMemo } from "react";

const INITIAL_FILTERS = {
    searchPhrase: "",
    status: "ALL",
    venue: "ALL",
    bowstyle: "ALL",
    ageCategory: "ALL",
    sex: "ALL",
    sortOrder: "NEWEST",
    startDate: "",
    endDate: ""
};

/**
 * This hook handles filtering and sorting of a list of score objects
 * @returns {Object} filters Current state holding all filter fields
 * @returns {Function} updateFilters Updates a filter by key (e.g. `updateFilters("bowstyle", "COMPOUND")`)
 * @returns {Function} clearFilters Resets filter state to `INITIAL_FILTERS`
 * @returns {boolean} hasActiveFilters `True` when `filters !== INITIAL_FILTERS`
 */
export const useScoreFilters = () => {
    const [ filters, setFilters ] = useState(INITIAL_FILTERS);

    const updateFilters = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => setFilters(INITIAL_FILTERS);

    const hasActiveFilters = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS);
    }, [ filters ]);

    return {
        filters,
        updateFilters,
        clearFilters,
        hasActiveFilters
    };
};
