import { useCallback, useEffect, useState, useMemo } from "react";
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

    const filterBarProps = useScoreFilters();
    const { filters, localSearch } = filterBarProps;

    const paginationProps = usePagination();
    const {
        loadNumber,
        currentPage, setCurrentPage,
        setTotalPages,
        totalCount, setTotalCount
    } = paginationProps;

    const displayedScores = useMemo(() => {
        if (!localSearch) {
            return scores;
        }

        return scores.filter(score =>
            score.roundName.toLowerCase().includes(localSearch.toLowerCase())
        );
    }, [ localSearch, scores ]);

    useEffect(() => {
        setCurrentPage(1);
    }, [filters, setCurrentPage]);

    const fetchScores = useCallback(async (page) => {
        if (!authIsReady || !user?.id) return;

        setError(null);
        setIsLoading(true);

        try {
            const queryParams = new URLSearchParams({
                page,
                limit: loadNumber,
                ...filters
            }).toString();

            const response = await makeApiCall(`/api/scores/user/${user.id}?${queryParams}`);
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
    }, [ user?.id, authIsReady, makeApiCall, loadNumber, filters, setTotalCount, setTotalPages ]);

    useEffect(() => {
        fetchScores(currentPage);
    }, [ currentPage, loadNumber, fetchScores ]);

    const handleDeletion = (id) => {
        setScores(prev => prev.filter(score => score.id !== id));
    };

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
                    { isLoading && scores.length === 0
                        ? "Searching..."
                        : (
                            <>{ totalCount } scores found. { scores.length !== totalCount && <span>({scores.length} displayed.)</span> }</>
                        )
                    }
                </p>
            </header>

            <div className={styles.scoreList}>
                { displayedScores.length > 0 ? (
                    displayedScores.map(score => (
                        <ScoreItem
                            score={score}
                            onDelete={handleDeletion} key={score.id}
                            isEditable={true}
                        />
                    ))
                ) : !isLoading && (
                    <p className="small centred">No scores to display. Submit one <Link to="../scores/submit">here</Link>.</p>
                )}
            </div>

            <Pagination paginationProps={paginationProps} />

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MyScores;
