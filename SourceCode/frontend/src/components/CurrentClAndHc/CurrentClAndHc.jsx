import { Warehouse, Sun } from "lucide-react";
import { useState } from "react";

import styles from "./CurrentClAndHc.module.css";
import EnumMap from "../../lib/enumMap";
import dashboardStyles from "../../styles/Dashboard.module.css";
import tabStyles from "../../styles/SelectorTabs.module.css";

const CurrentClassificationsAndHandicaps = ({ summary, isLoading, error }) => {

    const [ activeBowstyleIndex, setActiveBowstyleIndex ] = useState(0);

    const hasData = !isLoading && summary?.bowstyleSummaries?.length > 0;
    const currentBowstyleSummary = hasData ? summary.bowstyleSummaries[activeBowstyleIndex] : null;

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>Current Classifications and Handicaps.</h2>

            { hasData && (
                <div className={tabStyles.tabs}>
                    {summary.bowstyleSummaries.map((style, idx) => (
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

            { !isLoading && currentBowstyleSummary && (
                <div className={styles.content}>
                    <div className={styles.statsRow}>
                        <div className={styles.dataGroup}>
                            <div className={styles.groupLabel}>
                                <Warehouse />
                                Indoor
                            </div>

                            <div className={styles.displayGroup}>

                                <div className={styles.dataPoint}>
                                    <label className="small">Classification</label>
                                    <span>{EnumMap[currentBowstyleSummary.indoorClassification] || "Unclassified"}</span>
                                </div>

                                <div className={styles.dataPoint}>
                                    <label className="small">Handicap</label>
                                    <span>{currentBowstyleSummary.indoorHandicap ?? "-"}</span>
                                </div>

                            </div>
                        </div>

                        <div className={styles.dataGroup}>
                            <div className={styles.groupLabel}>
                                <Sun />
                                Outdoor
                            </div>

                            <div className={styles.displayGroup}>

                                <div className={styles.dataPoint}>
                                    <label className="small">Classification</label>
                                    <span>{EnumMap[currentBowstyleSummary.outdoorClassification] || "Unclassified"}</span>
                                </div>

                                <div className={styles.dataPoint}>
                                    <label className="small">Handicap</label>
                                    <span>{currentBowstyleSummary.outdoorHandicap ?? "-"}</span>
                                </div>

                            </div>
                        </div>
                    </div>

                    { summary?.notes && (
                        <div className={styles.notesSection}>
                            <label className="small">Records Officers&apos; Notes</label>
                            <p>{ summary.notes }</p>
                        </div>
                    )}
                </div>
            )}

            { !isLoading && !summary && (
                <p className="small centred">No summary to display. A summary will be created when a Records Officer first processes a score.</p>
            ) }

            { isLoading && <p className="small centred">Loading...</p> }
            { error && <p className="error-message">{error}</p> }
        </div>
    );
};

export default CurrentClassificationsAndHandicaps;
