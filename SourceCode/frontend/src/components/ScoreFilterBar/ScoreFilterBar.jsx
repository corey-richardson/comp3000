import { RotateCcw } from "lucide-react";

import styles from "./FilterBar.module.css";
import EnumMap from "../../lib/enumMap";

const ScoreFilterBar = ({ filterBarProps, paginationProps }) => {

    const { filters, updateFilters, clearFilters, hasActiveFilters } = filterBarProps;
    const { loadNumber, setLoadNumber } = paginationProps;

    return (
        <div className={styles.filterContainer}>

            <div className={styles.filterRow}>
                <input
                    type="text"
                    placeholder="Search round name..."
                    value={filters.searchPhrase}
                    onChange={(e) => updateFilters("searchPhrase", e.target.value)}
                    className={styles.searchInput}
                />

                <select
                    value={filters.status}
                    onChange={(e) => updateFilters("status", e.target.value)}
                >
                    <option value="ALL">All Statuses</option>
                    <option value="SUBMITTED">{ EnumMap["SUBMITTED"] }</option>
                    <option value="VERIFIED">{ EnumMap["VERIFIED"] } Scores</option>
                    <option value="REJECTED">{ EnumMap["REJECTED"] } Scores</option>
                </select>

                <select
                    value={filters.venue}
                    onChange={(e) => updateFilters("venue", e.target.value)}
                >
                    <option value="ALL">All Venues</option>
                    <option value="INDOOR">{ EnumMap["INDOOR"] }</option>
                    <option value="OUTDOOR">{ EnumMap["OUTDOOR"] }</option>
                </select>
            </div>

            <div className={styles.filterRow}>
                <select
                    value={filters.bowstyle}
                    onChange={(e) => updateFilters("bowstyle", e.target.value)}
                >
                    <option value="ALL">All Bowstyles</option>
                    <option value="BAREBOW">{ EnumMap["BAREBOW"] }</option>
                    <option value="COMPOUND">{ EnumMap["COMPOUND"] }</option>
                    <option value="RECURVE">{ EnumMap["RECURVE"] }</option>
                    <option value="LONGBOW">{ EnumMap["LONGBOW"] }</option>
                </select>

                <select
                    value={filters.ageCategory}
                    onChange={(e) => updateFilters("ageCategory", e.target.value)}
                >
                    <option value="ALL">All Age Categories</option>
                    <option value="SENIOR">{ EnumMap["SENIOR"] }</option>
                    <option value="OVER_FIFTY">{ EnumMap["OVER_FIFTY"] }</option>
                    <option value="UNDER_12">{ EnumMap["UNDER_12"] }</option>
                    <option value="UNDER_14">{ EnumMap["UNDER_14"] }</option>
                    <option value="UNDER_15">{ EnumMap["UNDER_15"] }</option>
                    <option value="UNDER_16">{ EnumMap["UNDER_16"] }</option>
                    <option value="UNDER_18">{ EnumMap["UNDER_18"] }</option>
                    <option value="UNDER_21">{ EnumMap["UNDER_21"] }</option>
                </select>

                <select
                    value={filters.sex}
                    onChange={(e) => updateFilters("sex", e.target.value)}
                >
                    <option value="ALL">All Sexes</option>
                    <option value="OPEN">{ EnumMap["OPEN"] }</option>
                    <option value="FEMALE">{ EnumMap["FEMALE"] }</option>
                </select>
            </div>

            <div className={styles.filterRow}>
                <select
                    value={filters.sortOrder}
                    onChange={(e) => updateFilters("sortOrder", e.target.value)}
                >
                    <option value="NEWEST">Newest First</option>
                    <option value="OLDEST">Oldest First</option>
                    <option value="SCORE">Highest Score</option>
                </select>

                <select
                    value={loadNumber}
                    onChange={(e) => setLoadNumber(e.target.value)}
                >
                    <option value="10">Load: 10</option>
                    <option value="25">Load: 25</option>
                    <option value="50">Load: 50</option>
                    <option value="100">Load: 100</option>
                    <option value="500">Load: 500</option>
                    <option value="1000">Load: 1000</option>
                </select>

                <div className={styles.dateGroup}>
                    <div className={styles.inputWrapper}>
                        <label className="small">From:</label>
                        <input
                            type="date"
                            value={filters.startDate}
                            onChange={(e) => updateFilters("startDate", e.target.value)}
                        />
                    </div>

                    <div className={styles.inputWrapper}>
                        <label className="small">To:</label>
                        <input
                            type="date"
                            value={filters.endDate}
                            onChange={(e) => updateFilters("endDate", e.target.value)}
                        />
                    </div>
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
