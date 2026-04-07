import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import EditableScoreItem from "../../components/EditableScoreItem/EditableScoreItem";
import Pagination from "../../components/Pagination/Pagination";
import RecordsSummaryEditor from "../../components/RecordsSummaryEditor/RecordsSummaryEditor";
import ScoreFilterBar from "../../components/ScoreFilterBar/ScoreFilterBar";
import { useApi } from "../../hooks/useApi";
import { usePagination } from "../../hooks/usePagination";
import { useScoreFilters } from "../../hooks/useScoreFilters";

const MemberScores = () => {
    const { userId } = useParams();
    const { makeApiCall } = useApi();

    const [ user, setUser ] = useState(null);
    const [ scores, setScores] = useState([]);
    const [ summary, setSummary ] = useState(null);

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
            const response = await makeApiCall(`/api/scores/user/${userId}?limit=${loadNumber}&page=${page}`);
            if (!response) {
                return; // 401
            };

            if (response.ok) {
                const data = await response.json();

                setUser(data.user);
                setScores(data.scores);
                setSummary(data.summary);

                setTotalPages(data.pagination.totalPages);
                setTotalCount(data.pagination.totalCount);
            }

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    }, [ userId, makeApiCall, loadNumber, setTotalPages, setTotalCount ]);

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
            <Breadcrumbs customLabel={`${user?.firstName} ${user?.lastName}`} />

            <div>
                <h2>Scores for {`${user?.firstName} ${user?.lastName}`}</h2>
                <RecordsSummaryEditor userId={userId} initialSummary={summary} />
                <ScoreFilterBar
                    filterBarProps={filterBarProps}
                    paginationProps={paginationProps}
                />

                <p className="small">{ totalCount } scores found. { scores.length !== totalCount && <span>({filteredScores.length} displayed.)</span> }</p>
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

export default MemberScores;
