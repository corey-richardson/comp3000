import { useCallback, useMemo, useState } from "react";

import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import calculateAgeCategory from "../../lib/calculateAgeCategory.js";
import EnumMap from "../../lib/enumMap.js";
import formStyles from "../../styles/Forms.module.css";

const DetailsForm = ({ profile, setProfile, isLoading, setIsLoading, error, setError }) => {
    const { user } = useAuthContext();
    const { makeApiCall } = useApi();

    const [ changesPending, setChangesPending ] = useState(false);

    const [ message, setMessage ] = useState("");

    const displayAgeCategory = useMemo(() => {
        const year = parseInt(profile?.yearOfBirth);
        if (isNaN(year)) return "Please set year.";
        return EnumMap[calculateAgeCategory(year)];
    }, [ profile?.yearOfBirth]);

    const handleInputChange = useCallback((key) => (e) => {
        const newValue = e.target.value;
        setProfile(prev => ({ ...prev, [key]: newValue }));
        setChangesPending(true);
    }, [ setProfile ]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            const response = await makeApiCall(`/api/profiles/${user.id}`, {
                method: "PATCH",
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
            if (!response) return; // 401

            if (!response.ok) {
                const data = await response.json();
                throw Error(data.error);
            }

            setChangesPending(false);
            setMessage("Your details have been updated successfully.");

        } catch (error) {
            setError(error.message);
        } finally {
            setIsLoading(false);
        }
    };

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

                    <div className={formStyles.fieldGroup}>
                        <label htmlFor="username">*Username:</label>
                        <input type="text" id="username" value={profile?.username ?? ""} onChange={handleInputChange("username")} required/>
                    </div>
                </div>

                <div className={formStyles.row}>

                    <div className={formStyles.fieldGroup}>
                        <label htmlFor="name">*Email:</label>
                        <input type="email" id="email" value={profile?.email ?? ""} onChange={handleInputChange("email")} required/>
                    </div>

                    <div className={formStyles.fieldGroup}>
                        <label>Archery GB Number:</label>
                        <input value={profile?.membershipNumber ?? ""} onChange={ handleInputChange("membershipNumber") } placeholder="1234567" />
                    </div>

                </div>

                <div className={formStyles.row}>

                    <div className={formStyles.fieldGroup}>
                        <label>Default Bowstyle:</label>
                        <select value={profile?.defaultBowstyle ?? "NOT_SET"} onChange={ handleInputChange("defaultBowstyle") }>
                            <option disabled value="NOT_SET">Please Select</option>
                            <option value="RECURVE">{ EnumMap["RECURVE"] }</option>
                            <option value="BAREBOW">{ EnumMap["BAREBOW"] }</option>
                            <option value="COMPOUND">{ EnumMap["COMPOUND"] }</option>
                            <option value="LONGBOW">{ EnumMap["LONGBOW"] }</option>
                        </select>
                    </div>

                    <div className={formStyles.fieldGroup}>
                        <label>Sex (as per AGB):</label>
                        <select value={profile?.sex ?? "NOT_SET"} onChange={ handleInputChange("sex") }>
                            <option value="NOT_SET" disabled>Please Select</option>
                            <option value="OPEN">{ EnumMap["OPEN"] }</option>
                            <option value="FEMALE">{ EnumMap["FEMALE"] }</option>
                        </select>
                    </div>

                    <div className={formStyles.fieldGroup}>
                        <label>Year of Birth:</label>
                        <input
                            value={profile?.yearOfBirth ?? ""}
                            onChange={ handleInputChange("yearOfBirth") }
                            type="number"
                            step="1"
                            min="1900" max={new Date().getFullYear()}
                            placeholder="Please Set"
                        />
                    </div>

                    <div className={formStyles.fieldGroup}>
                        <label>Age Category:</label>
                        <input disabled value={displayAgeCategory} />
                    </div>
                </div>

                { !isLoading && !changesPending && <button disabled>Save Details</button> }
                { !isLoading && changesPending && <button type="submit">Save Details</button> }
                { isLoading && <button disabled>Loading...</button> }
            </form>

            { !isLoading && message && (
                <p className="small centred">{ message }</p>
            )}

            {error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default DetailsForm;
