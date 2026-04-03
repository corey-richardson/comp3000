import { RotateCcw } from "lucide-react";

import styles from "./FilterBar.module.css";

const ScoreFilterBar = ({ filterBarProps }) => {

    const {
        clearFilters,
        hasActiveFilters,
        searchPhrase, setSearchPhrase,
        filterStatus, setFilterStatus,
        filterVenue, setFilterVenue,
        sortOrder, setSortOrder,
        startDate, setStartDate,
        endDate, setEndDate
    } = filterBarProps;

    return (
        <div className={styles.filterContainer}>
            <input
                type="text"
                placeholder="Search round name..."
                value={searchPhrase}
                onChange={e => setSearchPhrase(e.target.value)}
                className={styles.searchInput}
            />

            <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
            >
                <option value="ALL">All Statuses</option>
                <option value="SUBMITTED">Submitted</option>
                <option value="VERIFIED">Verified</option>
                <option value="REJECTED">Rejected</option>
            </select>

            <select
                value={filterVenue}
                onChange={(e) => setFilterVenue(e.target.value)}
            >
                <option value="ALL">All Venues</option>
                <option value="INDOOR">Indoor</option>
                <option value="OUTDOOR">Outdoor</option>
            </select>

            <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
            >
                <option value="NEWEST">Newest First</option>
                <option value="OLDEST">Oldest First</option>
                <option value="SCORE">Highest Score</option>
            </select>

            <div className={styles.dateGroup}>
                <div className={styles.inputWrapper}>
                    <label className="small">From:</label>
                    <input
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className={styles.inputWrapper}>
                    <label className="small">To:</label>
                    <input
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>
            </div>

            { hasActiveFilters && (
                <button
                    className={styles.clearButton}
                    onClick={clearFilters}
                    title="Clear all filters"
                >
                    <RotateCcw />
                    <span>Clear</span>
                </button>
            )}
        </div>
    );
};

export default ScoreFilterBar;
