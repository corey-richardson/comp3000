import { useCallback, useEffect, useState } from "react";
import { useAuthContext } from "../../hooks/useAuthContext";

import calculateAgeCategory from "../../lib/calculateAgeCategory.js";
import EnumMap from "../../lib/enumMap.js";

import formStyles from "../../styles/Forms.module.css";

const DetailsFormSkeleton = () => {
    return ( 
        <div>
            <h2>My Details.</h2>
            <p className="small centred">Loading...</p>
        </div>
    );
}

const DetailsForm = () => {
    const { user } = useAuthContext();

    const [ profile, setProfile ] = useState(null);
    const [ refreshFlag, setRefreshFlag ] = useState(false); // to be used in handleSubmit
    const [ changesPending, setChangesPending ] = useState(false);

    const [ loading, setLoading ] = useState(true);
    const [ error, setError ] = useState("");
    const [ message, setMessage ] = useState("");

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user?.id) return;
            try {
                const response = await fetch(`/api/profiles/${user.id}`, {
                    headers: {
                        'Authorization': `Bearer ${user.token}` // Add JWT Header
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.error);
                    setLoading(false);
                    return;
                }

                setProfile(data);
                setLoading(false);

                setMessage(`Your details were last updated at ${
                    new Date(data.updated_at || data.created_at).toLocaleString()
                }.`);
            } catch (err) {
                setError("Failed to fetch profile.");
            } finally {
                setLoading(false);
            }
        }

        fetchProfile();
    }, [ user, refreshFlag ]);


    const handleInputChange = useCallback((key) => (e) => {
            const newValue = e.target.value;
            setProfile(prev => ({ ...prev, [key]: newValue }));
            setChangesPending(true);
        },
        []
    );

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/profiles/${user.id}`, {
                method: "PATCH",
                headers: {
                    "Authorization": `Bearer ${user.token}`,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    firstName: profile?.firstName,
                    lastName: profile?.lastName,
                    username: profile?.username,
                    email: profile?.email,
                    membershipNumber: profile?.membershipNumber,
                    sex: profile?.sex === "NOT_SET" ? null : profile?.sex,
                    yearOfBirth: profile?.yearOfBirth ? parseInt(profile?.yearOfBirth) : null,
                    defaultBowstyle: profile?.defaultBowstyle === "NOT_SET" ? null : profile?.defaultBowstyle            
                })
            });

            if (!response.ok) {
                const data = await response.json();
                throw Error(data.error);
            }

            setRefreshFlag(prev => !prev);
            setChangesPending(false);
            setMessage("Your details have been updated successfully.");

        } catch (err) {
            setError("An error occurred while saving.");
        } finally {
            setLoading(false);
        }
    }

    if (loading) return <DetailsFormSkeleton />;

    return ( 
        <div className={`${formStyles.formContainer} ${formStyles.fullWidth}`}>
            <h2>My Details.</h2>

            <form onSubmit={handleSubmit}>
                <div className={formStyles.row}>
                    <div className={formStyles.fieldGroup}>
                        <label htmlFor="firstName">*First Name:</label>
                        <input type="text" id="firstName" value={profile?.firstName ?? ""} onChange={handleInputChange("firstName")} required/>
                    </div>

                    <div className={formStyles.fieldGroup}>
                        <label htmlFor="lastName">*Last Name:</label>
                        <input type="text" id="lastName" value={profile?.lastName ?? ""} onChange={handleInputChange("lastName")} required/>
                    </div>
                </div>

                <label htmlFor="username">*Username:</label>
                <input type="text" id="username" value={profile?.username ?? ""} onChange={handleInputChange("username")} required/>

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

                <input disabled value={calculateAgeCategory(parseInt(profile?.yearOfBirth ?? "") ?? EnumMap["SENIOR"])} />

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

            { !loading && message && (
                <p className="small centred">{ message }</p>
            )}
            
            {error && <p className="error-message">{ error }</p>}
        </div>
    );
}
 
export { DetailsFormSkeleton, DetailsForm };
