import { useState } from "react";

import { useApi } from "../../hooks/useApi";

const UserInviteList = ({ invites, isLoading, error }) => {
    return (
        <>
            <p>User Invite List</p>
            <p>Invites: {invites.length}</p>
            <p>Loading: {isLoading ? "true" : "false"}</p>
            <p>Error: {error}</p>
        </>
    );
};

export default UserInviteList;
