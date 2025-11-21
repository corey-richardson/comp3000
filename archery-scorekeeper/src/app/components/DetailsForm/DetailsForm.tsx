"use client";

import { useEffect, useState } from "react";

import type { ProfileData, PropTypes } from "@/types/profile";

const DetailsFormSkeleton = () => {
    return ( 
        <div>
            <h1>My Details Skeleton:</h1>
        </div>
    );
}

const DetailsForm = ({userId} : PropTypes) => {
    const [ profile, setProfile ] = useState<ProfileData | null>(null);

    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState("");

    useEffect(() => {
        const fetchProfile = async (profileId : string) => {
            console.log(profileId);
            const profileResponse = await fetch(`/api/profiles/${profileId}`);
            const profile = await profileResponse.json();

            if (!profileResponse.ok) {
                setError(profile.error);
                setLoading(false);
                return;
            }

            console.log(profile);

            setProfile(profile);
            setLoading(false);
        }

        fetchProfile(userId);
    }, [ userId ]);

    if (loading) {
        return <DetailsFormSkeleton />;
    }

    return ( 
        <div>
            <h1>My Details:</h1>
            <p>{ profile?.name }</p>
            
            {error && <p className="error-message">{ error }</p>}
        </div>
    );
}
 
export { DetailsFormSkeleton, DetailsForm };
