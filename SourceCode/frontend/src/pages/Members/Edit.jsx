import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import RoleSelection from "../../components/RoleSelection/RoleSelection";
import { useApi } from "../../hooks/useApi";
import calculateAgeCategory from "../../lib/calculateAgeCategory";
import EnumMap from "../../lib/enumMap";
import cardStyles from "../../styles/Card.module.css";
import formStyles from "../../styles/Forms.module.css";

const MemberEdit = () => {
    const { userId } = useParams();
    const { makeApiCall } = useApi();

    const location = useLocation();
    const { fromClub: clubId } = location.state || {};

    const navigate = useNavigate();

    const [ user, setUser ] = useState(null);
    const [ formData, setFormData ] = useState({
        membershipNumber: "",
        yearOfBirth: "",
        roles: ["MEMBER"]
    });

    const [ isLoading, setIsLoading ] = useState(true);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchUser = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const [ profileResponse, membershipResponse ] = await Promise.all([
                    makeApiCall(`/api/profiles/${userId}`),
                    makeApiCall(`/api/clubs/${clubId}/member/${userId}`)
                ]);

                if (profileResponse.ok && membershipResponse.ok) {
                    const profileData = await profileResponse.json();
                    const membershipData = await membershipResponse.json();

                    setUser(profileData);
                    setFormData({
                        membershipNumber: profileData.membershipNumber || "",
                        yearOfBirth: profileData.yearOfBirth || "",
                        roles: membershipData.roles || ["MEMBER"]
                    });
                } else {
                    throw new Error("Failed to fetch a complete member record.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        if (userId && clubId) {
            fetchUser();
        }

    }, [ userId, clubId, makeApiCall ]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleRoleChange = (role) => {
        setFormData((prev) => ({
            ...prev,
            roles: prev.roles.includes(role)
                ? prev.roles.filter((r) => r !== role)
                : [ ...prev.roles, role]
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError(null);

        try {
            const [ profileResponse, rolesResponse ] = await Promise.all([
                makeApiCall(`/api/profiles/${userId}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        membershipNumber: formData.membershipNumber,
                        yearOfBirth: formData.yearOfBirth ? Number(formData.yearOfBirth) : null,
                    })
                }),

                makeApiCall(`/api/clubs/${clubId}/member/${userId}`, {
                    method: "PATCH",
                    body: JSON.stringify({
                        roles: formData.roles
                    })
                })
            ]);

            if (!profileResponse.ok) {
                throw new Error("Failed to update Profile record.");
            }
            if (!rolesResponse) {
                throw new Error ("Failed to update Membership record.");
            }

            navigate(-1);

        } catch (error) {
            setError(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <div className="content">
                <Breadcrumbs customLabel="Loading..." />
                <p className="small centred">Loading user...</p>
            </div>
        );
    }

    return (
        <div className="content">
            <Breadcrumbs customLabel={`${user?.firstName} ${user?.lastName}`} />

            <h2>Edit {`${user?.firstName} ${user?.lastName}`}</h2>

            <div className={cardStyles.cardItem} style={{ marginBottom: "2rem" }}>
                <div className={cardStyles.topRow}>
                    <h3>{ user?.firstName } { user?.lastName } <span>({ user?.username })</span></h3>
                </div>

                <div className={cardStyles.mainInfo}>
                    <p>{ EnumMap[user?.defaultBowstyle] } { EnumMap[calculateAgeCategory(user?.yearOfBirth)] } { EnumMap[user?.sex] }</p>
                    <p>{ user?.email }</p>
                </div>

                <div className={cardStyles.footerRow}>
                    <span className={cardStyles.date}>
                        Account Registered: {new Date(user?.created_at).toLocaleDateString()}
                    </span>
                    <span className={cardStyles.date}>
                        Last Updated: {new Date(user?.updated_at).toLocaleString()}
                    </span>
                </div>
            </div>

            <form
                className={`${formStyles.formContainer} ${formStyles.fullWidth}`}
                onSubmit={handleSubmit}
            >
                <div className={formStyles.fieldGroup}>
                    <label htmlFor="membershipNumber">Archery GB Number</label>
                    <input
                        type="text"
                        id="membershipNumber"
                        name="membershipNumber"
                        value={formData.membershipNumber}
                        onChange={handleChange}
                        autoComplete="off"
                    />
                </div>

                <div className={formStyles.fieldGroup}>
                    <label htmlFor="yearOfBirth">Year of Birth</label>
                    <input
                        type="number"
                        id="yearOfBirth"
                        name="yearOfBirth"
                        min="1900"
                        max={new Date().getFullYear()}
                        value={formData.yearOfBirth}
                        onChange={handleChange}
                    />

                    <input
                        type="text"
                        placeholder="Age Category"
                        value={ formData.yearOfBirth ? EnumMap[calculateAgeCategory(parseInt(formData.yearOfBirth))] : "-" }
                        readOnly
                    />
                </div>

                <RoleSelection
                    selectedRoles={formData.roles}
                    onRoleChange={handleRoleChange}
                    isDisabled={isSubmitting}
                />

                { !isLoading && !isSubmitting && <button type="submit">Save Details</button> }
                { !isLoading && isSubmitting && <button disabled>Submitting...</button> }
                { isLoading && <button disabled>Loading...</button> }
            </form>

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MemberEdit;
