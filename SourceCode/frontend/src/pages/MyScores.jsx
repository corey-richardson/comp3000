import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";

import ScoreItem from "../components/ScoreItem/ScoreItem";
import { useApi } from "../hooks/useApi";
import { useAuthContext } from "../hooks/useAuthContext";
import paginationStyles from "../styles/Pagination.module.css";
import styles from "../styles/ScoreItem.module.css";

const MyScores = () => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    const [ scores, setScores ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    const [ currentPage, setCurrentPage ] = useState(1);
    const [ totalPages, setTotalPages ] = useState(1);
    const scoresPerPage = 10;

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

    const handleNext = () => setCurrentPage(prev => prev + 1);
    const handlePrev = () => setCurrentPage(prev => Math.max(prev - 1, 1));

    return (
        <div className="content">
            <header className={ styles.pageHeader }>
                <h2>My Scores.</h2>
            </header>

            { isLoading ? (
                <div>
                    <p className="small centred">Loading scores...</p>
                </div>
            ) : (
                <>
                    <div className={styles.scoreList}>
                        { scores.length > 0 ? (
                            scores.map(score => <ScoreItem score={score} onDelete={handleDeletion} key={score.id} />)
                        ) : (
                            <p className="small centred">No scores to display. Submit one <Link to="../submit-score">here</Link>.</p>
                        )}
                    </div>
                </>
            )}

            <div className={paginationStyles.paginationFooter}>
                <button
                    onClick={ handlePrev }
                    disabled={ currentPage === 1 || isLoading }
                    className={ paginationStyles.button }
                >
                    <ChevronLeft size={16} />
                </button>

                <span className={paginationStyles.pageInfo}>Viewing Page { currentPage } of { totalPages }</span>

                <button
                    onClick={ handleNext }
                    disabled={ currentPage === totalPages || isLoading }
                    className={ paginationStyles.button }
                >
                    <ChevronRight size={16} />
                </button>
            </div>
        </div>
    );
};

export default MyScores;
