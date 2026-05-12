import { useEffect, useState, useMemo } from "react";

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
    const [ localSearch, setLocalSearch ] = useState(INITIAL_FILTERS.searchPhrase);

    useEffect(() => {
        const debounceTimer = setTimeout(() => {
            setFilters(prev => ({ ...prev, searchPhrase: localSearch }));
        }, 500);

        return () => clearTimeout(debounceTimer);
    }, [ localSearch ]);

    const updateFilters = (key, value) => {
        console.log(key, value);
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => {
        setFilters(INITIAL_FILTERS);
        setLocalSearch(INITIAL_FILTERS.searchPhrase);
    };

    const hasActiveFilters = useMemo(() => {
        return Object.keys(INITIAL_FILTERS).some(
            key => filters[key] !== INITIAL_FILTERS[key]
        ) || localSearch !== INITIAL_FILTERS.searchPhrase;
    }, [ filters, localSearch ]);

    return {
        filters,
        localSearch, setLocalSearch,
        updateFilters,
        clearFilters,
        hasActiveFilters
    };
};
