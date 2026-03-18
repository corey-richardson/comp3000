import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import calculateAgeCategory from "../../lib/calculateAgeCategory";
import ScoreForm from "../ScoreForm/ScoreForm";

const TODAY = new Date();

const SubmitScoreForm = () => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    const navigate = useNavigate();

    // STATE

    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const [ formData, setFormData ] = useState({
        dateShot: TODAY,
        venue: "INDOOR",
        roundNameSearch: "",
        bowstyle: "",
        competition: "PRACTICE",
        score: "",
        xs: "",
        tens: "",
        nines: "",
        hits: "",
        notes: "",
        journal: "",
        ageCategory: "SENIOR",
        sex: "OPEN"
    });

    // FETCH USER INFO

    const userDataRef = useRef(null);
    useEffect(() => {
        const fetchUser = async () => {
            if (!authIsReady || !user?.id) return;

            if (userDataRef.current) {
                setFormData(prev => ({
                    ...prev,
                    bowstyle: userDataRef.current.defaultBowstyle,
                    ageCategory: userDataRef.current.ageCategory,
                    sex: userDataRef.current.sex
                }));
                return;
            }

            try {
                const response = await makeApiCall(`/api/profiles/${user.id}`);
                if (!response) return; // 401

                const data = await response.json();
                if (!response.ok) {
                    throw Error(data.error);
                }

                const calculatedAgeCategory = calculateAgeCategory(data.yearOfBirth);

                userDataRef.current = {
                    defaultBowstyle: data.defaultBowstyle,
                    ageCategory: calculatedAgeCategory,
                    sex: data.sex
                };

                setFormData(prev => ({
                    ...prev,
                    bowstyle: data.defaultBowstyle || "",
                    ageCategory: calculatedAgeCategory || "SENIOR",
                    sex: data.sex || "OPEN"
                }));

            } catch (_error) {
                setError("Failed to fetch user data.");
            }
        };

        fetchUser();
    }, [ user, authIsReady, makeApiCall ]);

    // HANDLERS

    const handlePost = async (e, roundData) => {
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

        try {
            const response = await makeApiCall("/api/scores", {
                method: "POST",
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
        } catch (error) {
            setError("Failed to submit score.");
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <ScoreForm
            formData={formData}
            setFormData={setFormData}
            handleSubmit={handlePost}
            buttonText="Submit Score"
            error={error}
        />
    );
};

export default SubmitScoreForm;
