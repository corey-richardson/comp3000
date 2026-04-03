import { Save, CheckCircle, AlertCircle, Warehouse, Sun } from "lucide-react";
import { useState } from "react";

import styles from "./RecordsSummaryEditor.module.css";
import { useApi } from "../../hooks/useApi";
import EnumMap from "../../lib/enumMap";

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

    const [ formData, setFormData ] = useState({ ...initialSummary });
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [status, setStatus] = useState({ type: null, message: "" });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name.includes("Handicap") ? (value ? parseInt(value) : null) : value
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

        } catch (_error) {
            setStatus({ type: "error", message: "Error saving records summary." });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={styles.summaryContainer}>
            <div className={styles.header}>
                <h3>Records Summary</h3>
            </div>

            <form onSubmit={handleSubmit} className={styles.editorBody}>
                <div className={styles.statsRow}>
                    <div className={styles.dataGroup}>

                        <div className={styles.groupLabel}>
                            <Warehouse /> Indoor
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputWrapper}>
                                <label className="small">Classification Achieved</label>
                                <select
                                    name="indoorClassification"
                                    value={formData.indoorClassification}
                                    onChange={handleChange}
                                >
                                    {INDOOR_CLASSIFICATIONS.map((cl) => (
                                        <option key={cl} value={cl}>{EnumMap[cl]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputWrapper}>
                                <label className="small">Classification Badge Received:</label>
                                <select
                                    name="indoorClassificationBadgeGiven"
                                    value={formData.indoorClassificationBadgeGiven}
                                    onChange={handleChange}
                                >
                                    {INDOOR_CLASSIFICATIONS.map((cl) => (
                                        <option key={cl} value={cl}>{EnumMap[cl]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputWrapper}>
                                <label className="small">Handicap:</label>
                                <input
                                    type="number"
                                    name="indoorHandicap"
                                    value={formData.indoorHandicap || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.dataGroup}>
                        <div className={styles.groupLabel}>
                            <Sun /> Outdoor
                        </div>

                        <div className={styles.inputGroup}>
                            <div className={styles.inputWrapper}>
                                <label className="small">Classification Achieved:</label>
                                <select
                                    name="outdoorClassification"
                                    value={formData.outdoorClassification}
                                    onChange={handleChange}
                                >
                                    {OUTDOOR_CLASSIFICATIONS.map((cl) => (
                                        <option key={cl} value={cl}>{EnumMap[cl]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputWrapper}>
                                <label className="small">Classification Badge Received:</label>
                                <select
                                    name="outdoorClassificationBadgeGiven"
                                    value={formData.outdoorClassificationBadgeGiven}
                                    onChange={handleChange}
                                >
                                    {OUTDOOR_CLASSIFICATIONS.map((cl) => (
                                        <option key={cl} value={cl}>{EnumMap[cl]}</option>
                                    ))}
                                </select>
                            </div>

                            <div className={styles.inputWrapper}>
                                <label className="small">HC:</label>
                                <input
                                    type="number"
                                    name="outdoorHandicap"
                                    value={formData.outdoorHandicap || ""}
                                    onChange={handleChange}
                                />
                            </div>
                        </div>
                    </div>

                    <div className={styles.inputGroup}>
                        <textarea
                            name="notes"
                            value={formData.notes || ""}
                            onChange={handleChange}
                            placeholder="Add administrative notes about this archer..."
                            className={styles.notesInput}
                            rows="5"
                        />
                    </div>
                </div>

                <div className={styles.footerRow}>
                    <div className={styles.statusContainer}>
                        {status.type && (
                            <span className={`${styles.statusMessage} ${status.type === "success" ? "" : "error-message"} small`}>
                                {status.type === "success" ? <CheckCircle size={16} /> : <AlertCircle size={16} />}
                                {status.message}
                            </span>
                        )}
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className={styles.saveButton}
                    >
                        <Save />
                        <span>{isSubmitting ? "Saving..." : "Save"}</span>
                    </button>
                </div>
            </form>
        </div>
    );
};

export default RecordsSummaryEditor;
