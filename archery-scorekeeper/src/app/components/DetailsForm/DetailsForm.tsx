"use client";

import { useCallback, useEffect, useState } from "react";

import type { ProfileData, PropTypes } from "@/types/profile";
import calculateAgeCategory from "@/app/lib/calculateAgeCategory";
import EnumMap from "@/app/lib/enumMap";

const DetailsFormSkeleton = () => {
    return ( 
        <div>
            <h2>My Details</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
}

const DetailsForm = ({userId} : PropTypes) => {
    const [ profile, setProfile ] = useState<ProfileData | null>(null);
    const [ ageCategory, setAgeCategory ] = useState("NOT_SET");

    const [ refreshFlag, setRefreshFlag ] = useState(false); // to be used in handleSubmit
    const [ changesPending, setChangesPending ] = useState(false);
    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState("");

    useEffect(() => {
        const fetchProfile = async (profileId : string) => {
            const profileResponse = await fetch(`/api/profiles/${profileId}`);
            const profile = await profileResponse.json();

            if (!profileResponse.ok) {
                setError(profile.error);
                setLoading(false);
                return;
            }

            setProfile(profile);
            setLoading(false);
        }

        fetchProfile(userId);
    }, [ userId, refreshFlag ]);

    useEffect(() => {
        const year = parseInt(profile?.yearOfBirth ?? "");
        setAgeCategory(calculateAgeCategory(year));
    }, [ profile?.yearOfBirth ]);

    // Handlers

    // setName
    // const handleInputChange = useCallback(
    //     (setter: React.Dispatch<React.SetStateAction<string>>) => (
    //         e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    //             setter(e.target.value);
    //             setChangesPending(true);
    //         },
    //     []
    // );

    const handleInputChange = useCallback(
        (key: keyof ProfileData) => (
            e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
                const newValue = e.target.value;

                setProfile(prev => {
                    if (!prev) return prev;

                    return {
                        ...prev,
                        [key]: newValue
                    };
                });

                setChangesPending(true);
            },
        []
    );

    if (loading) {
        return <DetailsFormSkeleton />;
    }

    return ( 
        <div>
            <h2>My Details</h2>

            <form>
                <label htmlFor="name">*Name:</label>
                <input type="text" id="name" value={profile?.name ?? ""} onChange={handleInputChange("name")} required/>

                <label htmlFor="name">*Email:</label>
                <input type="email" id="email" value={profile?.email ?? ""} onChange={handleInputChange("email")} required/>

                <label>Archery GB Number:</label>
                <input value={profile?.membershipNumber ?? ""} onChange={ handleInputChange("membershipNumber") } placeholder="1234567" />

                <label>Sex Category (as per AGB):</label>
                <select value={profile?.sex ?? "NOT_SET"} onChange={ handleInputChange("sex") }>
                    <option value="NOT_SET" disabled>Please Select</option>
                    <option value="OPEN">{ EnumMap["OPEN"] }</option>
                    <option value="FEMALE">{ EnumMap["FEMALE"] }</option>
                </select>

                <label>Year of Birth:</label>
                <input
                    value={profile?.yearOfBirth ?? ""}
                    onChange={ handleInputChange("yearOfBirth") }
                    type="number"
                    step="1"
                    min="1900" max={new Date().getFullYear()}
                    placeholder="Please Set"/>

                <input disabled value={ageCategory ?? ""} />

                <label>Default Bowstyle:</label>
                <select value={profile?.defaultBowstyle ?? "NOT_SET"} onChange={ handleInputChange("defaultBowstyle") }>
                    <option disabled value="NOT_SET">Please Select</option>
                    <option value="RECURVE">{ EnumMap["RECURVE"] }</option>
                    <option value="BAREBOW">{ EnumMap["BAREBOW"] }</option>
                    <option value="COMPOUND">{ EnumMap["COMPOUND"] }</option>
                    <option value="LONGBOW">{ EnumMap["LONGBOW"] }</option>
                </select>

                { !loading && !changesPending && <button disabled>Save Details</button> }
                { !loading && changesPending && <button type="submit">Save Details</button> }
                { loading && <button disabled>Loading...</button> }
            </form>

            { !loading && (
                <p className="small centred">
                    Your details were last updated at { profile &&
                        new Date(profile?.updated_at !== null ? profile.updated_at : profile.created_at).toLocaleString()
                    }.
                </p>
            )}
            
            {error && <p className="error-message">{ error }</p>}
        </div>
    );
}
 
export { DetailsFormSkeleton, DetailsForm };
