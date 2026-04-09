import { useCallback, useEffect, useState } from "react";
import { useLocation, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import Pagination from "../../components/Pagination/Pagination";
import ScoreFilterBar from "../../components/ScoreFilterBar/ScoreFilterBar";
import EditableScoreItem from "../../components/ScoreItems/EditableScoreItem";
import { useApi } from "../../hooks/useApi";
import { usePagination } from "../../hooks/usePagination";
import { useScoreFilters } from "../../hooks/useScoreFilters";

const RecordsManagement = () => {
    const club = useParams();

    const { makeApiCall } = useApi();

    const location = useLocation();
    const { clubName } = location.state || {};

    const [ scores, setScores ] = useState([]);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ isPendingAction, setIsPendingAction ] = useState(false);
    const [ error, setError ] = useState(null);

    const filterBarProps = useScoreFilters(scores);
    const { filteredScores } = filterBarProps;

    const paginationProps = usePagination();
    const {
        loadNumber,
        currentPage, setTotalPages,
        totalCount, setTotalCount
    } = paginationProps;

    const fetchScores = useCallback(async (page) => {
        setIsLoading(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/scores/club/${club.id}?limit=${loadNumber}&page=${page}`);
            if (!response) {
                return; // 401
            };

            if (response.ok) {
                const data = await response.json();
                setScores(data.scores);

                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [ club.id, makeApiCall, loadNumber, setTotalPages, setTotalCount ]);

    useEffect(() => {
        fetchScores(currentPage);
    }, [currentPage, loadNumber, fetchScores]);

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
            <Breadcrumbs />

            <div>
                <h2>Scores for { clubName }</h2>
                <ScoreFilterBar
                    filterBarProps={filterBarProps}
                    paginationProps={paginationProps}
                />

                <p className="small">{ totalCount } scores found. { filteredScores.length !== totalCount && <span>({filteredScores.length} displayed.)</span> }</p>
            </div>

            { filteredScores.map(score => (
                <EditableScoreItem
                    key={score.id}
                    score={score}
                    onDelete={handleDelete}
                    onStatusUpdate={handleStatusUpdate}
                    isPending={isPendingAction}
                />
            ))}

            <Pagination paginationProps={paginationProps} />

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default RecordsManagement;
