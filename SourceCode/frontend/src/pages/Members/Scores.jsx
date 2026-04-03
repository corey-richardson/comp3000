import { useCallback, useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import EditableScoreItem from "../../components/EditableScoreItem/EditableScoreItem";
import Pagination from "../../components/Pagination/Pagination";
import { useApi } from "../../hooks/useApi";
import styles from "../../styles/FilterBar.module.css";

const MemberScores = () => {
    const { userId } = useParams();
    const { makeApiCall } = useApi();

    const [ user, setUser ] = useState(null);
    const [ scores, setScores] = useState([]);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ isPendingAction, setIsPendingAction ] = useState(false);
    const [ error, setError ] = useState(null);

    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const scoresPerPage = 100;

    const [ searchPhrase, setSearchPhrase ] = useState("");
    const [ filterState, setFilterState ] = useState("ALL");
    const [ sortOrder, setSortOrder ] = useState("NEWEST");
    const [ startDate, setStartDate ] = useState("");
    const [ endDate, setEndDate ] = useState("");

    const filteredScores = useMemo(() => {
        return scores.filter(score => {
            const matchesSearch = score.roundName.toLowerCase().includes(searchPhrase.toLowerCase());
            const matchesFilter = filterState === "ALL" || score.status === filterState;

            const dateShot = new Date(score.dateShot).setHours(0, 0, 0, 0);
            const start = startDate ? new Date(startDate).setHours(0, 0, 0, 0) : null;
            const end = endDate ? new Date(endDate).setHours(0, 0, 0, 0) : null;

            const matchesDate = (!start || dateShot >= start) && (!end || dateShot <= end );

            return matchesSearch && matchesFilter && matchesDate;
        }).sort((a, b) => {
            if (sortOrder === "NEWEST") {
                return new Date(b.date) - new Date(a.date);
            }
            if (sortOrder === "OLDEST") {
                return new Date(a.date) - new Date(b.date);
            }
            if (sortOrder === "SCORE") {
                return b.score - a.score;
            }

            return 0;
        });
    }, [scores, searchPhrase, filterState, sortOrder, startDate, endDate]);

    const fetchScores = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/scores/user/${userId}?limit=${scoresPerPage}&page=${page}`);
            if (!response) {
                return; // 401
            };

            if (response.ok) {
                const data = await response.json();

                setUser(data.user);
                setScores(data.scores);
                setTotalPages(data.pagination.totalPages);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [userId, makeApiCall, scoresPerPage]);

    useEffect(() => {
        fetchScores(currentPage);
    }, [currentPage, fetchScores]);

    const handleStatusUpdate = async (id, newStatus) => {
        setIsPendingAction(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/scores/${id}/status`, {
                method: "PATCH",
                body: JSON.stringify({ status: newStatus })
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            setScores(prev =>
                prev.map(score => score.id === id ? { ...score, status: newStatus } : score)
            );

        } catch (error) {
            setError(error.message);
        } finally {
            setIsPendingAction(false);
        }
    };

    const handleDelete = async (id) => {
        setIsPendingAction(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/scores/${id}`, {
                method: "DELETE"
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            setScores(prev =>
                prev.filter(score => score.id !== id)
            );
        } catch (error) {
            setError(error.message);
        } finally {
            setIsPendingAction(false);
        }
    };

    if (isLoading) {
        return (
            <div className="content">
                <Breadcrumbs customLabel="Loading..." />
                <p className="small centred">Loading scores...</p>
            </div>
        );
    }

    return (
        <div className="content">
            <Breadcrumbs customLabel={`${user?.firstName} ${user?.lastName}`} />

            <div className={styles.header}>
                <h2>Scores for {`${user?.firstName} ${user?.lastName}`}</h2>
                <p className="small">{scores.length} scores to display. { scores.length !== filteredScores.length && <span>({filteredScores.length} displayed.)</span> }</p>

                <div className={styles.filterContainer}>
                    <input
                        type="text"
                        placeholder="Search round name..."
                        value={searchPhrase}
                        onChange={e => setSearchPhrase(e.target.value)}
                        className={styles.searchInput}
                    />

                    <select
                        value={filterState}
                        onChange={(e) => setFilterState(e.target.value)}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="SUBMITTED">Submitted</option>
                        <option value="VERIFIED">Verified</option>
                        <option value="REJECTED">Rejected</option>
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
                </div>
            </div>

            <div>
                { filteredScores.map(score => (
                    <EditableScoreItem
                        key={score.id}
                        score={score}
                        onDelete={handleDelete}
                        onStatusUpdate={handleStatusUpdate}
                        isPending={isPendingAction}
                    />
                ))}
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MemberScores;
