import { useEffect, useState, useMemo } from "react";

import { useApi } from "../../hooks/useApi";
import EnumMap from "../../lib/enumMap";
import formStyles from "../../styles/Forms.module.css";

const ScoreForm = ({ formData, setFormData, handleSubmit, isLoading, error, buttonText }) => {

    const { makeApiCall } = useApi();

    const [allRounds, setAllRounds] = useState(null);
    const [ isLoadingRounds, setIsLoadingRounds ] = useState(false);

    // SELECT OPTIONS

    const options = useMemo(() => ({
        bowstyle: [
            { value: "BAREBOW", label: EnumMap["BAREBOW"] },
            { value: "RECURVE", label: EnumMap["RECURVE"] },
            { value: "COMPOUND", label: EnumMap["COMPOUND"] },
            { value: "LONGBOW", label: EnumMap["LONGBOW"] },
            { value: "OTHER", label: EnumMap["OTHER"] }
        ],
        competition: [
            { value: "PRACTICE", label: EnumMap["PRACTICE"] },
            { value: "CLUB_EVENT", label: EnumMap["CLUB_EVENT"] },
            { value: "OPEN_COMPETITION", label: EnumMap["OPEN_COMPETITION"] },
            { value: "RECORD_STATUS_COMPETITION", label: EnumMap["RECORD_STATUS_COMPETITION"] }
        ],
        venue: [
            { value: "INDOOR", label: EnumMap["INDOOR"] },
            { value: "OUTDOOR", label: EnumMap["OUTDOOR"] }
        ]
    }), []);

    // FETCH ROUNDS LIST

    useEffect(() => {
        const fetchAllRounds = async () => {
            setIsLoadingRounds(true);
            const response = await makeApiCall("/api/rounds");
            if (response.ok) {
                const data = await response.json();
                setAllRounds(data);
            }

            setIsLoadingRounds(false);
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

    return (
        <form className={`${formStyles.formContainer} ${formStyles.fullWidth}`} onSubmit={(e) => handleSubmit(e, selectedRoundData)}>
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
                        {options.venue.map((option) => (
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

                        {options.bowstyle.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className={formStyles.fieldGroup}>
                    <label>*Competition Level:</label>
                    <select value={formData.competition} name="competition" onChange={handleChange} required>
                        {options.competition.map((option) => (
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

            <button type="submit" disabled={isLoading || !isRoundValid}>
                {isLoading ? "Saving..." : buttonText}
            </button>

            { error && <p className="error-message">{error}</p> }
        </form>
    );
};

export default ScoreForm;
