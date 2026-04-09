import { Link } from "react-router-dom";

import ScoreItem from "./ScoreItem";
import dashboardStyles from "../../styles/Dashboard.module.css";

const RecentScores = ({ scores, totalCount, isLoading, error }) => {

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>Recent Scores.</h2>

            { !isLoading && scores && scores.length > 0 && (
                <>
                    { scores.map(score => (
                        <ScoreItem
                            score={score}
                            key={score.id}
                            minimal={true}
                        />
                    )) }

                    <p className="small centred">Displaying { scores.length } of { totalCount } scores. See all of your scores on the <Link to="../scores">My Scores</Link> page.</p>
                </>
            )}

            { !isLoading && scores && scores.length === 0 && <p className="small centred">No scores to display.</p> }

            { isLoading && <p className="small centred">Loading...</p> }
            { error && <p className="error-message">{error}</p> }
        </div>
    );
};

export default RecentScores;
