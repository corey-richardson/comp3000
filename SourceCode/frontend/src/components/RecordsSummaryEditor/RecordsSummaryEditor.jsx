import { Save, CheckCircle, AlertCircle, Warehouse, Sun } from "lucide-react";
import { useState } from "react";

import styles from "./RecordsSummaryEditor.module.css";
import { useApi } from "../../hooks/useApi";
import EnumMap from "../../lib/enumMap";
import tabStyles from "../../styles/SelectorTabs.module.css";

const INDOOR_CLASSIFICATIONS = [
    "UC",
    "IA3", "IA2", "IA1",
    "IB3", "IB2", "IB1",
    "IMB", "IGMB"
];

const OUTDOOR_CLASSIFICATIONS = [
    "UC",
    "A3", "A2", "A1",
    "B3", "B2", "B1",
    "MB", "GMB", "EMB"
];

const RecordsSummaryEditor = ({ userId, initialSummary }) => {
    const { makeApiCall } = useApi();

    const [ formData, setFormData ] = useState({
        notes: initialSummary?.notes || "",
        bowstyleSummaries: initialSummary?.bowstyleSummaries || [],
    });

    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ status, setStatus ] = useState({ type: null, message: "" });
    const [ activeBowstyleIndex, setActiveBowstyleIndex ] = useState(0);

    const handleNotesChange = (e) => {
        setFormData(prev => ({ ...prev, notes: e.target.value }));
    };

    const handleSummaryChange = (e, index) => {
        const { name, value } = e.target;
        const updatedSummaries =  [...formData.bowstyleSummaries ];

        updatedSummaries[index] = {
            ...updatedSummaries[index],
            [name]: name.includes("Handicap") ? (value ? parseInt(value) : null) : value
        };

        setFormData(prev => ({
            ...prev,
            bowstyleSummaries: updatedSummaries
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setStatus({ type: null, message: "" });

        try {
            const response = await makeApiCall(`/api/profiles/${userId}/summary`, {
                method: "PATCH",
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            setStatus({ type: "success", message: "Saved" });
            setTimeout(() => (
                setStatus({ type: null, message: "" })
            ), 5000);

        } catch (error) {
            setStatus({ type: "error", message: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentSummary = formData.bowstyleSummaries[activeBowstyleIndex];

    return (
        <div className={styles.summaryContainer}>
            <div className={styles.header}>
                <h3>Records Summaries</h3>
            </div>

            { formData.bowstyleSummaries.length > 0 && (
                <div className={tabStyles.tabs}>
                    {formData.bowstyleSummaries.map((style, idx) => (
                        <button
                            key={style.bowstyle}
                            type="button"
                            className={`${tabStyles.tab} ${activeBowstyleIndex === idx ? tabStyles.activeTab : ""}`}
                            onClick={() => setActiveBowstyleIndex(idx)}
                        >
                            {EnumMap[style.bowstyle]}
                        </button>
                    ))}
                </div>
            )}

            <form onSubmit={handleSubmit} className={styles.editorBody}>
                {currentSummary ? (
                    <div className={styles.statsRow}>

                        <div className={styles.dataGroup}>

                            <div className={styles.groupLabel}>
                                <Warehouse />
                                Indoor ({ EnumMap[currentSummary.bowstyle] })
                            </div>

                            <div className={styles.inputGroup}>

                                <div className={styles.inputWrapper}>
                                    <label>Calculated Classification Achieved</label>
                                    <input
                                        type="text"
                                        value={ EnumMap[currentSummary.indoorClassification] || "Unclassified" }
                                        readOnly
                                    />
                                </div>

                                <div className={styles.inputWrapper}>
                                    <label>Highest Classification Badge Awarded</label>
                                    <select
                                        name="indoorClassificationBadgeGiven"
                                        value={currentSummary.indoorClassificationBadgeGiven || "UNCLASSIFIED"}
                                        onChange={(e) => handleSummaryChange(e, activeBowstyleIndex)}
                                    >
                                        {INDOOR_CLASSIFICATIONS.map(cl => <option key={cl} value={cl}>{ EnumMap[cl] || cl }</option>)}
                                    </select>
                                </div>

                                <div className={styles.inputWrapper}>
                                    <label>Calculated Handicap Achieved</label>
                                    <input
                                        type="number"
                                        name="indoorHandicap"
                                        value={currentSummary.indoorHandicap || "-"}
                                        readOnly
                                    />
                                </div>

                            </div>
                        </div>

                        <div className={styles.dataGroup}>
                            <div className={styles.groupLabel}><Sun size={18}/> Outdoor ({EnumMap[currentSummary.bowstyle]})</div>
                            <div className={styles.inputGroup}>

                                <div className={styles.inputWrapper}>
                                    <label>Calculated Classification Achieved</label>
                                    <input
                                        type="text"
                                        value={ EnumMap[currentSummary.outdoorClassification] || "Unclassified" }
                                        readOnly
                                    />
                                </div>

                                <div className={styles.inputWrapper}>
                                    <label>Highest Classification Badge Awarded</label>
                                    <select
                                        name="outdoorClassificationBadgeGiven"
                                        value={currentSummary.outdoorClassificationBadgeGiven || "UNCLASSIFIED"}
                                        onChange={(e) => handleSummaryChange(e, activeBowstyleIndex)}
                                    >
                                        {OUTDOOR_CLASSIFICATIONS.map(cl => <option key={cl} value={cl}>{EnumMap[cl] || cl}</option>)}
                                    </select>
                                </div>

                                <div className={styles.inputWrapper}>
                                    <label>Calculated Handicap Achieved</label>
                                    <input
                                        type="number"
                                        name="outdoorHandicap"
                                        value={currentSummary.outdoorHandicap || "-"}
                                        readOnly
                                    />
                                </div>

                            </div>
                        </div>
                    </div>
                ) : (
                    <div className={styles.emptyState}>
                        <p className="small centred">
                            No summary data has been generated for this user yet. <br/>
                            Verify a score to calculate their initial classification and handicap values.
                        </p>
                    </div>
                )}

                <div className={styles.notesSection}>
                    <label>Records Officers&apos; Notes</label>
                    <p className="small">These notes are visible to the archer.</p>
                    <textarea
                        value={formData.notes}
                        onChange={handleNotesChange}
                        placeholder="General notes about the archer..."
                        rows="3"
                    />
                </div>

                <div className={styles.footerRow}>
                    <div className={styles.statusContainer}>
                        {status.type && (
                            <span className={`${styles.statusMessage} ${styles[status.type]}`}>
                                {status.type === "success" ? <CheckCircle /> : <AlertCircle />}
                                {status.message}
                            </span>
                        )}
                    </div>

                    <button type="submit" disabled={isSubmitting} className={styles.saveButton}>
                        <Save size={20} />
                        <span>{isSubmitting ? "Saving..." : "Save Profile"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecordsSummaryEditor;
