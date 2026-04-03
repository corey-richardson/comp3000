import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Pagination from "../../components/Pagination/Pagination";
import ScoreFilterBar from "../../components/ScoreFilterBar/ScoreFilterBar";
import ScoreItem from "../../components/ScoreItem/ScoreItem";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import { useScoreFilters } from "../../hooks/useScoreFilters";
import styles from "../../styles/ScoreItem.module.css";

const MyScores = () => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    const [ scores, setScores ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);
    const scoresPerPage = 100;

    const filterBarProps = useScoreFilters(scores);
    const { filteredScores } = filterBarProps;

    const fetchScores = useCallback(async (currentPage) => {
        if (!authIsReady || !user?.id) return;

        setError(null);
        setIsLoading(true);

        try {
            const response = await makeApiCall(`/api/scores/user/${user.id}?limit=${scoresPerPage}&page=${currentPage}`);
            if (!response) return; // 401

            const data = await response.json();
            if (response.ok) {
                setScores(data.scores);
                setTotalPages(data.pagination.totalPages);

            }
        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [ user?.id, authIsReady, makeApiCall, scoresPerPage ]);

    useEffect(() => {
        fetchScores(currentPage);
    }, [ currentPage, scoresPerPage, fetchScores ]);

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
                />

                <p className="small">{scores.length} scores to display. { scores.length !== filteredScores.length && <span>({filteredScores.length} displayed.)</span> }</p>
            </header>

            { isLoading ? (
                <div>
                    <p className="small centred">Loading scores...</p>
                </div>
            ) : (
                <>
                    <div className={styles.scoreList}>
                        { filteredScores.length > 0 ? (
                            filteredScores.map(score => <ScoreItem score={score} onDelete={handleDeletion} key={score.id} />)
                        ) : (
                            <p className="small centred">No scores to display. Submit one <Link to="../scores/submit">here</Link>.</p>
                        )}
                    </div>
                </>
            )}

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                setCurrentPage={setCurrentPage}
            />

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MyScores;
