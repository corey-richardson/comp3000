import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import { useApi } from "../../hooks/useApi";

const MemberEmergencyContacts = () => {
    const { userId } = useParams();
    const { makeApiCall } = useApi();

    const [ user, setUser ] = useState(null);
    const [ contacts, setContacts ] = useState([]);

    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    useEffect(() => {
        const fetchContacts = async () => {
            setIsLoading(true);
            setError(null);

            try {
                const response = await makeApiCall(`/api/contacts/user/${userId}`);
                if (!response) return; // 401

                if (response.ok) {
                    const data = await response.json();
                    setUser(data.user);
                    setContacts(data.contacts);
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setIsLoading(false);
            }
        };

        fetchContacts();
    }, [ userId, makeApiCall ]);

    if (isLoading) {
        return (
            <div className="content">
                <Breadcrumbs customLabel="Loading..." />
                <p className="small centred">Loading contacts...</p>
            </div>
        );
    }

    return (
        <div className="content">
            <Breadcrumbs customLabel={`${user?.firstName} ${user?.lastName}`} />

            <h2>Emergency Contacts for {`${user?.firstName} ${user?.lastName}`}</h2>
            <p className="small">{contacts.length} contacts to display.</p>

            { error && <p className="error-message">{ error }</p>}
        </div>
    );
};

export default MemberEmergencyContacts;
