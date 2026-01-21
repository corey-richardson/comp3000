import type { ProfileData as _ProfileData, PropTypes } from "@/types/profile";

const EmergencyContactsSkeleton = () => {
    return ( 
        <div>
            <h2>Emergency Contact Details</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
}

const EmergencyContacts = ({userId} : PropTypes) => {
    return ( 
        <div>
            <h2>Emergency Contact Details</h2>
        </div>
    );
}
 
export { EmergencyContactsSkeleton, EmergencyContacts };
