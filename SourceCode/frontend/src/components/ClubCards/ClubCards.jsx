import { Link } from "react-router-dom";

import ClubCard from "./ClubCard";
import dashboardStyles from "../../styles/Dashboard.module.css";

const ClubCards = ({ clubs, totalCount, isLoading, error }) => {

    return (
        <div className={dashboardStyles.dashboardContainer}>
            <h2>My Clubs.</h2>

            <div className={dashboardStyles.clubList}>
                {!isLoading && clubs.length > 0 ? (
                    <>
                        { clubs.map((membership) => (
                            <ClubCard membership={membership} key={membership.id} />
                        )) }

                        <p className="small centred">Displaying { clubs.length } of { totalCount } clubs. See all of the clubs you are a member of on the <Link to="../clubs">My Clubs</Link> page.</p>
                    </>
                ) : (
                    <p className="small centred">No clubs to display.</p>
                )}
            </div>

            { isLoading && <p className="small centred">Loading clubs...</p> }
            { error && <p className="error-message">{ error }</p> }
        </div>
    );
};

export default ClubCards;
