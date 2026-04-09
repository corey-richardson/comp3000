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
            if (filters.sortOrder === "SCORE") {
                return b.score - a.score;
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
