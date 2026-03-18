import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import EditScoreForm from "../../components/EditScoreForm/EditScoreForm";
import { useApi } from "../../hooks/useApi";

const EditScore = () => {
    const { id: scoreId } = useParams();
    const { makeApiCall } = useApi();

    const [ score, setScore ] = useState(null);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchScore = async () => {
            setError(null);
            setIsLoading(true);

            try {
                const response = await makeApiCall(`/api/scores/${scoreId}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setScore(data);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchScore();
    }, [ scoreId, makeApiCall ]);

    return (
        <div className="centred content">
            <Breadcrumbs customLabel={`${score?.roundName} (${new Date(score?.dateShot).toLocaleDateString()})`} />

            {isLoading ? (
                <p>Loading score...</p>
            ) : (
                <EditScoreForm score={ score } />
            )}

            { error && <p className={"centred error-message"}>{ error }</p>}
        </div>
    );
};

export default EditScore;
