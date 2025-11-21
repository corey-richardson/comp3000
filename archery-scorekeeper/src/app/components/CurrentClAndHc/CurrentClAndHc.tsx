import type { ProfileData as _ProfileData, PropTypes } from "@/types/profile";

const CurrentClassificationsAndHandicapsSkeleton = () => {
    return ( 
        <div>
            <h2>Current Classifications and Handicaps</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
}

const CurrentClassificationsAndHandicaps = ({userId} : PropTypes) => {
    return ( 
        <div>
            <h2>Current Classifications and Handicaps</h2>
        </div>
    );
}
 
export { CurrentClassificationsAndHandicapsSkeleton, CurrentClassificationsAndHandicaps };
