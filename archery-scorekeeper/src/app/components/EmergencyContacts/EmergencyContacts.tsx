interface PropTypes {
    userId: string;
}

const EmergencyContactsSkeleton = () => {
    return ( 
        <div>
            <h1>Emergency Contact Details</h1>
        </div>
    );
}

const EmergencyContacts = ({userId} : PropTypes) => {
    return ( 
        <div>
            <h1>Emergency Contact Details</h1>
        </div>
    );
}
 
export { EmergencyContactsSkeleton, EmergencyContacts };
