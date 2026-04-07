import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Pagination from "../../components/Pagination/Pagination";
import ScoreFilterBar from "../../components/ScoreFilterBar/ScoreFilterBar";
import ScoreItem from "../../components/ScoreItems/ScoreItem";
import styles from "../../components/ScoreItems/ScoreItem.module.css";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import { usePagination } from "../../hooks/usePagination";
import { useScoreFilters } from "../../hooks/useScoreFilters";

const MyScores = () => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    const [ scores, setScores ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const filterBarProps = useScoreFilters(scores);
    const { filteredScores } = filterBarProps;

    const paginationProps = usePagination();
    const {
        currentPage,
        loadNumber,
        setTotalPages,
        totalCount, setTotalCount
    } = paginationProps;

    const fetchScores = useCallback(async (currentPage) => {
        if (!authIsReady || !user?.id) return;

        setError(null);
        setIsLoading(true);

        try {
            const response = await makeApiCall(`/api/scores/user/${user.id}?limit=${loadNumber}&page=${currentPage}`);
            if (!response) return; // 401

            const data = await response.json();
            if (response.ok) {
                setScores(data.scores);

                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [ user?.id, authIsReady, makeApiCall, loadNumber, setTotalCount, setTotalPages ]);

    useEffect(() => {
        fetchScores(currentPage);
    }, [ currentPage, loadNumber, fetchScores ]);

    const handleDeletion = (id) => {
        setScores(prev => prev.filter(score => score.id !== id));
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
            <Breadcrumbs />

            <header className={ styles.pageHeader }>
                <h2>My Scores.</h2>

                <ScoreFilterBar
                    filterBarProps={filterBarProps}
                    paginationProps={paginationProps}
                />

                <p className="small">
                    {filteredScores.length} {filteredScores.length === 1 ? "score" : "scores"} displayed.

                    {filteredScores.length !== scores.length && (
                        <span> ({scores.length} loaded)</span>
                    )}

                    {scores.length !== paginationProps.totalCount && (
                        <span> ({ totalCount } total)</span>
                    )}
                </p>
            </header>

            <div className={styles.scoreList}>
                { filteredScores.length > 0 ? (
                    filteredScores.map(score => (
                        <ScoreItem score={score} onDelete={handleDeletion} key={score.id} />
                    ))
                ) : (
                    <p className="small centred">No scores to display. Submit one <Link to="../scores/submit">here</Link>.</p>
                )}
            </div>

            <Pagination paginationProps={paginationProps} />

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MyScores;
