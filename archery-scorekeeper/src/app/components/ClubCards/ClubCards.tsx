import type { ProfileData as _ProfileData, PropTypes } from "@/types/profile";

const ClubCardsSkeleton = () => {
    return ( 
        <div>
            <h2>My Clubs</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
}

const ClubCards = ({userId} : PropTypes) => {
    return ( 
        <div>
            <h2>My Clubs</h2>
        </div>
    );
}
 
export { ClubCardsSkeleton, ClubCards };
