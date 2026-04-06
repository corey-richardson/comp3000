
import { useEffect, useState } from "react";

import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import UserInviteList from "../../components/InviteManagement/UserInviteList";

const MemberInvites = () => {

    const [ invites, setInvites ] = useState([]);
    const [ isLoading, setIsLoading ] = useState(true);
    const [ error, setError ] = useState(null);

    return (
        <div className="content">
            <Breadcrumbs />

            <h2>Invites</h2>
            <UserInviteList
                invites={invites}
                isLoading={isLoading}
                error={error}
            />
        </div>
    );
};

export default MemberInvites;
