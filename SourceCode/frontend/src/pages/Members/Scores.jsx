import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import EditableScoreItem from "../../components/EditableScoreItem/EditableScoreItem";
import { useApi } from "../../hooks/useApi";

const MemberScores = () => {
    const { userId } = useParams();
    const { makeApiCall } = useApi();

    const [ user, setUser ] = useState(null);
    const [ scores, setScores] = useState([]);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ isPendingAction, setIsPendingAction ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchScores = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await makeApiCall(`/api/scores/user/${userId}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setScores(data.scores);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScores();
    }, [ userId, makeApiCall ]);

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

            <h2>Scores for {`${user?.firstName} ${user?.lastName}`}</h2>
            <p className="small">{scores.length} scores to display.</p>

            <div>
                { scores.map(score => (
                    <EditableScoreItem
                        key={score.id}
                        score={score}
                        onDelete={handleDelete}
                        onStatusUpdate={handleStatusUpdate}
                        isPending={isPendingAction}
                    />
                ))}
            </div>

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MemberScores;
