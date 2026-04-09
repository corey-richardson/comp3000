import { Warehouse, Sun } from "lucide-react";
import { useState } from "react";

import styles from "./CurrentClAndHc.module.css";
import EnumMap from "../../lib/enumMap";
import cardStyles from "../../styles/Card.module.css";
import tabStyles from "../../styles/SelectorTabs.module.css";

const ClassificationCard = ({
    venue,
    classification,
    handicap
}) => {
    const Icon = venue === "Indoor" ? Warehouse : Sun;

    return (
        <div className={cardStyles.cardItem}>
            <div className={cardStyles.topRow}>
                <div className={styles.groupLabel}>
                    <Icon />
                    <span>{ venue }</span>
                </div>
            </div>

            <div className={styles.displayGroup}>

                <div className={styles.dataPoint}>
                    <label className="small">Classification</label>
                    <span>{EnumMap[classification] || "Unclassified"}</span>
                </div>

                <div className={styles.dataPoint}>
                    <label className="small">Handicap</label>
                    <span>{handicap ?? "-"}</span>
                </div>

            </div>
        </div>
    );
};

const CurrentClassificationsAndHandicaps = ({ summary, isLoading, error }) => {

    const [ activeBowstyleIndex, setActiveBowstyleIndex ] = useState(0);

    const hasData = !isLoading && summary?.bowstyleSummaries?.length > 0;
    const currentBowstyleSummary = hasData ? summary.bowstyleSummaries[activeBowstyleIndex] : null;

    return (
        <>
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

                        <ClassificationCard
                            venue="Indoor"
                            classification={currentBowstyleSummary.indoorClassification}
                            handicap={currentBowstyleSummary.indoorHandicap}
                        />

                        <ClassificationCard
                            venue="Outdoor"
                            classification={currentBowstyleSummary.outdoorClassification}
                            handicap={currentBowstyleSummary.outdoorHandicap}
                        />

                    </div>

                    {summary?.notes && (
                        <div className={cardStyles.cardItem}>
                            <div className={cardStyles.topRow}>
                                <span className={cardStyles.date}>Records Officers&apos; Notes</span>
                            </div>
                            <p className={styles.notesText}>{ summary.notes }</p>
                        </div>
                    )}
                </div>
            )}

            { !isLoading && !summary && (
                <p className="small centred">No summary to display. A summary will be created when a Records Officer first processes a score.</p>
            ) }

            { isLoading && <p className="small centred">Loading...</p> }
            { error && <p className="error-message">{error}</p> }
        </>
    );
};

export default CurrentClassificationsAndHandicaps;
