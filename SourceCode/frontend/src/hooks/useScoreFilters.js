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
 * @param {Array} [unfilteredScores=[]] The array of scores to filter
 * @returns {Array} filteredScores A list of filtered scores, derived from `unfilteredScores`
 * @returns {Object} filters Current state holding all filter fields
 * @returns {Function} updateFilters Updates a filter by key (e.g. `updateFilters("bowstyle", "COMPOUND")`)
 * @returns {Function} clearFilters Resets filter state to `INITIAL_FILTERS`
 * @returns {boolean} hasActiveFilters `True` when `filters !== INITIAL_FILTERS`
 */
export const useScoreFilters = (unfilteredScores = []) => {
    const [ filters, setFilters ] = useState(INITIAL_FILTERS);

    const updateFilters = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    const clearFilters = () => setFilters(INITIAL_FILTERS);

    const hasActiveFilters = useMemo(() => {
        return JSON.stringify(filters) !== JSON.stringify(INITIAL_FILTERS);
    }, [ filters ]);

    const filteredScores = useMemo(() => {
        if (!unfilteredScores) return [];

        return unfilteredScores.filter(score => {
            const matchesSearch = score.roundName.toLowerCase().includes(filters.searchPhrase.toLowerCase());

            const matchesStatus = filters.status === "ALL" || score.status === filters.status;
            const matchesVenue = filters.venue === "ALL" || score.venue === filters.venue;
            const matchesBowstyle = filters.bowstyle === "ALL" || score.bowstyle === filters.bowstyle;
            const matchesAgeCategory = filters.ageCategory === "ALL" || score.ageCategory === filters.ageCategory;
            const matchesSex = filters.sex === "ALL" || score.user?.sex === filters.sex;

            const dateShot = new Date(score.dateShot).setHours(0, 0, 0, 0);
            const start = filters.startDate ? new Date(filters.startDate).setHours(0, 0, 0, 0) : null;
            const end = filters.endDate ? new Date(filters.endDate).setHours(0, 0, 0, 0) : null;
            const matchesDate = (!start || dateShot >= start) && (!end || dateShot <= end);

            return (
                matchesSearch &&
                matchesStatus && matchesVenue &&
                matchesBowstyle && matchesSex && matchesAgeCategory &&
                matchesDate
            );

        }).sort((a, b) => {
            if (filters.sortOrder === "NEWEST") {
                return new Date(b.dateShot) - new Date(a.dateShot);
            }
            if (filters.sortOrder === "OLDEST") {
                return new Date(a.dateShot) - new Date(b.dateShot);
            }
            if (filters.sortOrder === "SCORE_ASC") {
                return a.score - b.score;
            }
            if (filters.sortOrder === "SCORE_DESC") {
                return b.score - a.score;
            }
            if (filters.sortOrder === "HANDICAP_ASC") {
                return b.handicap - a.handicap;
            }
            if (filters.sortOrder === "HANDICAP_DESC") {
                return a.handicap - b.handicap;
            }

            return 0;
        });
    }, [ unfilteredScores, filters ]);

    return {
        filteredScores,
        filters,
        updateFilters,
        clearFilters,
        hasActiveFilters
    };
};
