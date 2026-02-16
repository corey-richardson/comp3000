import { useEffect, useState, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import calculateAgeCategory from "../../lib/calculateAgeCategory";
import EnumMap from "../../lib/enumMap";
import formStyles from "../../styles/Forms.module.css";

const TODAY = new Date();

const SubmitScoreForm = () => {
    const { user, authIsReady } = useAuthContext();
    const { makeApiCall } = useApi();

    const navigate = useNavigate();

    // STATE

    const [ isLoading, setIsLoading ] = useState(false);
    const [ error, setError ] = useState(null);

    const [allRounds, setAllRounds] = useState(null);
    const [ isLoadingRounds, setIsLoadingRounds ] = useState(false);

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

    // SELECT OPTIONS

    const bowstyleOptions = useMemo(() => [
        { value: "BAREBOW", label: EnumMap["BAREBOW"] },
        { value: "RECURVE", label: EnumMap["RECURVE"] },
        { value: "COMPOUND", label: EnumMap["COMPOUND"] },
        { value: "LONGBOW", label: EnumMap["LONGBOW"] },
        { value: "OTHER", label: EnumMap["OTHER"] }
    ], []);

    const competitionLevelOptions = useMemo(() => [
        { value: "PRACTICE", label: EnumMap["PRACTICE"] },
        { value: "CLUB_EVENT", label: EnumMap["CLUB_EVENT"] },
        { value: "OPEN_COMPETITION", label: EnumMap["OPEN_COMPETITION"] },
        { value: "RECORD_STATUS_COMPETITION", label: EnumMap["RECORD_STATUS_COMPETITION"] }
    ], []);

    const roundTypeOptions = useMemo(() => [
        { value: "INDOOR", label: EnumMap["INDOOR"] },
        { value: "OUTDOOR", label: EnumMap["OUTDOOR"] }
    ], []);

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

    // FETCH ROUNDS LIST

    useEffect(() => {
        const fetchAllRounds = async () => {
            setIsLoadingRounds(true);
            try {
                const response = await makeApiCall("/api/rounds");
                if (!response) return; // 401

                const data = await response.json();
                setAllRounds(data);
            } catch (_error) {
                setError("Failed to fetch rounds.");
            } finally {
                setIsLoadingRounds(false);
            }
        };
        fetchAllRounds();
    }, [makeApiCall]);

    // ENFORCE AND VALIDATE ROUND SELECTION

    const selectedRoundData = useMemo(() => {
        if (!allRounds || !formData.venue || !formData.roundNameSearch) {
            return null;
        }

        return allRounds[formData.venue].find(
            (round) => round.name === formData.roundNameSearch
        );
    }, [ allRounds, formData.venue, formData.roundNameSearch ]);
    const isRoundValid = !!selectedRoundData;

    // HANDLERS

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData(prev => {
            const newData = { ...prev, [name]: value };

            if (name === "venue") {
                newData.roundNameSearch = "";
            } else if (name === "dateShot") {
                newData.dateShot = new Date(value);
            }

            return newData;
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!isRoundValid) {
            alert("Please select a valid round from the datalist.");
            return; // do nothing
        }
        else if (selectedRoundData && selectedRoundData.max_score < formData.score) {
            alert(`Score cannot exceed the maximum of ${selectedRoundData.max_score}.`);
            return;
        }
        else if (selectedRoundData && selectedRoundData.num_arrows < formData.hits) {
            alert(`Hits cannot exceed the maximum of ${selectedRoundData.num_arrows}.`);
            return;
        }

        setIsLoading(true);

        try {
            const response = await makeApiCall("/api/scores", {
                method: "POST",
                body: JSON.stringify({
                    ...formData,
                    roundName: selectedRoundData.name,
                    roundCodeName: selectedRoundData.codename,
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

            navigate("/dashboard"); // TODO: CHANGE TO MY SCORES PAGE WHEN IMPLEMENTED
        } catch (error) {
            setError("Failed to submit score.");
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <form className={`${formStyles.formContainer} ${formStyles.fullWidth}`} onSubmit={handleSubmit}>
            <div className={formStyles.row}>

                <div className={formStyles.fieldGroup}>
                    <label>*Date Shot:</label>
                    <input
                        type="date"
                        name="dateShot"
                        value={formData.dateShot.toISOString().slice(0, 10)}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>*Venue:</label>
                    <select name="venue" value={formData.venue} onChange={handleChange}>
                        {roundTypeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>*Round Name:</label>
                    <input
                        id="round-search"
                        type="text"
                        name="roundNameSearch"
                        list="rounds-datalist"
                        value={formData.roundNameSearch}
                        onChange={handleChange}
                        placeholder="Start Typing Round Name Here..."
                        className={!isRoundValid ? formStyles.inputError : ""}
                        disabled={isLoadingRounds}
                        required
                    />
                    <datalist id="rounds-datalist">
                        {allRounds && allRounds[formData.venue]?.map((round) => (
                            <option key={round.codename} value={round.name}>
                                {round.name}
                            </option>
                        ))}
                    </datalist>
                </div>

            </div>

            <div className={formStyles.row}>

                <div className={formStyles.fieldGroup}>
                    <label>*Bowstyle:</label>
                    <select
                        value={formData.bowstyle ?? ""}
                        name="bowstyle"
                        onChange={handleChange}
                        required
                    >
                        <option
                            disabled
                            value=""
                        >Please Select</option>

                        {bowstyleOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>*Competition Level:</label>
                    <select value={formData.competition} name="competition" onChange={handleChange} required>
                        {competitionLevelOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

            </div>

            <div className={formStyles.row}>

                <div className={formStyles.fieldGroup}>
                    <label>*Score{selectedRoundData && ` (Max: ${selectedRoundData.max_score})`}:</label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        max={selectedRoundData?.max_score}
                        value={formData.score}
                        name="score"
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>Xs:</label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        max={selectedRoundData?.num_arrows}
                        value={formData.xs}
                        name="xs"
                        onChange={handleChange}
                    />
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>Xs + Tens:</label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        max={selectedRoundData?.num_arrows}
                        value={formData.tens}
                        name="tens"
                        onChange={handleChange}
                    />
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>Nines:</label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        max={selectedRoundData?.num_arrows}
                        value={formData.nines}
                        name="nines"
                        onChange={handleChange}
                    />
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>Hits{selectedRoundData && ` (Max: ${selectedRoundData.num_arrows})`}:</label>
                    <input
                        type="number"
                        step="1"
                        min="0"
                        max={selectedRoundData?.num_arrows}
                        value={formData.hits}
                        name="hits"
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={formStyles.row}>

                <div className={formStyles.fieldGroup}>
                    <label>Notes:</label>
                    <textarea
                        value={formData.notes}
                        name="notes"
                        onChange={handleChange}
                        placeholder="Add any extra details about the score here, such as the location of the shoot, the name of the competition or the IANSEO link. These notes are visible to club administrators.">
                    </textarea>
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>Journal:</label>
                    <textarea
                        value={formData.journal}
                        name="journal"
                        onChange={handleChange}
                        placeholder="Add a reflection on your shooting here. How did your technique feel? How was your mental state during the shoot? Is there anything you believe needs working on with a coach? These notes are only visible to you and your club's coaches.">
                    </textarea>
                </div>
            </div>

            { !isLoading && <button type="submit" disabled={!isRoundValid}>Submit Score</button> }
            { isLoading && <button disabled>Submitting...</button> }

            { error && <p className="error-message">{error}</p> }
        </form>
    );
};

export default SubmitScoreForm;
