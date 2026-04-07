import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import ScoreForm from "./ScoreForm";
import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import calculateAgeCategory from "../../lib/calculateAgeCategory";

const TODAY = new Date();

const EditScoreForm = ({ score }) => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();
    const navigate = useNavigate();

    // STATE

    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const [ formData, setFormData ] = useState({
        dateShot: score?.dateShot ? new Date(score.dateShot) : TODAY,
        venue: score?.venue || "INDOOR",
        roundNameSearch: score?.roundName || "",
        bowstyle: score?.bowstyle || "",
        competition: score?.competition || "PRACTICE",
        score: score?.score || "",
        xs: score?.xs || "",
        tens: score?.tens || "",
        nines: score?.nines || "",
        hits: score?.hits || "",
        notes: score?.notes || "",
        journal: score?.journal || "",
        ageCategory: score?.ageCategory || "SENIOR",
        sex: score?.sex || "OPEN"
    });

    // Fetch Users Birth Year and Recalculate Age Category on Date change
    const userDataRef = useRef(null);

    useEffect(() => {
        const fetchUser = async () => {
            if (!authIsReady || !user?.id || userDataRef.current) return;

            try {
                const response = await makeApiCall(`/api/profiles/${user.id}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    userDataRef.current = { yearOfBirth: data.yearOfBirth };
                }

            } catch (_error) {
                // eslint-disable-next-line no-console
                console.warn("Failed to fetch user birth year for recalculation of age category.");
            }
        };

        fetchUser();
    }, [ user, authIsReady, makeApiCall ]);

    useEffect(() => {
        if (userDataRef.current?.yearOfBirth) {
            const yearShot = new Date(formData.dateShot).getFullYear();
            const updatedCategory = calculateAgeCategory( userDataRef.current.yearOfBirth, yearShot );

            if (formData.ageCategory !== updatedCategory) {
                setFormData(prev => ({
                    ...prev,
                    ageCategory: updatedCategory
                }));
            }
        }
    }, [ formData.dateShot, formData.ageCategory ]);

    // API Handlers
    const handlePut = async (e, roundData) => {
        e.preventDefault();

        if (!roundData) {
            alert("Please select a valid round from the datalist.");
            return; // do nothing
        }
        else if (roundData.max_score < formData.score) {
            alert(`Score cannot exceed the maximum of ${roundData.max_score}.`);
            return;
        }
        else if (roundData.num_arrows < formData.hits) {
            alert(`Hits cannot exceed the maximum of ${roundData.num_arrows}.`);
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/scores/${score.id}`, {
                method: "PUT",
                body: JSON.stringify({
                    ...formData,
                    roundName: roundData.name,
                    roundCodeName: roundData.codename,
                    score: Number(formData.score),
                    hits: Number(formData.hits),
                    xs: Number(formData.xs),
                    tens: Number(formData.tens),
                    nines: Number(formData.nines)
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw Error(data.error);
            }

            navigate("/scores");
        } catch (_error) {
            setError("Failed to edit score.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <h3>Edit {`${score?.roundName} (${new Date(score?.dateShot).toLocaleDateString()})`}</h3>

            <ScoreForm
                formData={formData}
                setFormData={setFormData}
                handleSubmit={handlePut}
                isLoading={isLoading}
                buttonText="Edit Score"
                error={error}
            />
        </>
    );
};

export default EditScoreForm;
