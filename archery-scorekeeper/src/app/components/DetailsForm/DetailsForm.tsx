interface PropTypes {
    userId: string;
}

const DetailsFormSkeleton = () => {
    return ( 
        <div>
            <h1>My Details:</h1>
        </div>
    );
}

const DetailsForm = ({userId} : PropTypes) => {
    return ( 
        <div>
            <h1>My Details:</h1>
        </div>
    );
}
 
export { DetailsFormSkeleton, DetailsForm };
