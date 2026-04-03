import { useState, useMemo } from "react";

export const useScoreFilters = (unfilteredScores) => {
    const [ searchPhrase, setSearchPhrase ] = useState("");

    const [ filterStatus, setFilterStatus ] = useState("ALL");
    const [ filterVenue, setFilterVenue ] = useState("ALL");

    const [ sortOrder, setSortOrder ] = useState("NEWEST");

    const [ startDate, setStartDate ] = useState("");
    const [ endDate, setEndDate ] = useState("");

    const filteredScores = useMemo(() => {
        return unfilteredScores.filter(score => {

            console.log(score);
            const matchesSearch = score.roundName.toLowerCase().includes(searchPhrase.toLowerCase());
            const matchesStatus = filterStatus === "ALL" || score.status === filterStatus;
            const matchesVenue = filterVenue === "ALL" || score.venue === filterVenue;

            const dateShot = new Date(score.dateShot).setHours(0, 0, 0, 0);
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
            const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

            const matchesDate = (!start || dateShot >= start) && (!end || dateShot <= end );

            return matchesSearch && matchesStatus && matchesVenue && matchesDate;
        }).sort((a, b) => {
            if (sortOrder === "NEWEST") {
                return new Date(b.dateShot) - new Date(a.dateShot);
            }
            if (sortOrder === "OLDEST") {
                return new Date(a.dateShot) - new Date(b.dateShot);
            }
            if (sortOrder === "SCORE") {
                return b.score - a.score;
            }

            return 0;
        });
    }, [unfilteredScores, searchPhrase, filterStatus, filterVenue, sortOrder, startDate, endDate]);

    return {
        filteredScores,
        searchPhrase, setSearchPhrase,
        filterStatus, setFilterStatus,
        filterVenue, setFilterVenue,
        sortOrder, setSortOrder,
        startDate, setStartDate,
        endDate, setEndDate
    };
};
