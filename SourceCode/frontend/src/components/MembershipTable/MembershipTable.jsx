import { Info, Siren, Pencil, Unlink } from "lucide-react";
import { useState } from "react";

import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import calculateAgeCategory from "../../lib/calculateAgeCategory";
import EnumMap from "../../lib/enumMap";
import styles from "../../styles/Tables.module.css";

const MembershipTable = ({ members: initialMemberState = [] }) => {

    const [ members, setMembers ] = useState(initialMemberState);
    const [ error, setError ] = useState(null);

    const { makeApiCall } = useApi();
    const { user } = useAuthContext();

    const currentUserMembership = members.find(m => m.userId === user.id);
    const currentUserRoles = currentUserMembership?.roles || [];

    if (!members || members.length === 0) {
        return (
            <div className="centred">
                <p>No members to display, or you do not have access to this club.</p>
            </div>
        );
    }

    const isAdmin = currentUserRoles.includes("ADMIN");
    const isCaptain = currentUserRoles.includes("CAPTAIN");
    const isRecords = currentUserRoles.includes("RECORDS");

    const handleViewScores = (member) => {
        console.log(member);
    };

    const handleViewContacts = (member) => {
        console.log(member.emergencyContacts);
    };

    const handleEditMember = (member) => {
        console.log(member);
    };

    const handleRemoveMember = async (member) => {
        const confirmation = window.confirm(`Are you sure you want to remove ${member.firstName} ${member.lastName} from this Club?`);

        if (!confirmation) {
            return;
        }

        try {
            setError(null);
            console.log(member.membershipId);
            const response = await makeApiCall(`/api/clubs/memberships/${member.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            setMembers(prev => prev.filter(m => m.id !== member.id));

        } catch (error) {
            setError(`Failed to remove member ${member.firstName} ${member.lastName}: ${error.message}`);
        }

    };

    return (
        <div className={styles.tableContainer}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Name</th>

                        {(isAdmin || isCaptain) && (
                            <th>Email</th>
                        )}

                        {(isAdmin || isCaptain || isRecords) && (
                            <>
                                <th>Membership Number</th>
                                <th>Sex</th>
                                <th>Year of Birth</th>
                                <th>Age Category</th>
                            </>
                        )}

                        <th>Roles</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    { members.map((member) => (
                        <tr key={member.id}>
                            <td>{ `${member.firstName} ${member.lastName}` }</td>

                            {(isAdmin || isCaptain) && (
                                <td>{ member.email || "-" }</td>
                            )}

                            {(isAdmin || isCaptain || isRecords) && (
                                <>
                                    <td>{ member.membershipNumber }</td>
                                    <td>{ EnumMap[member.sex] || member.sex || "-" }</td>
                                    <td>{ member.yearOfBirth || "-" }</td>
                                    <td>{ EnumMap[calculateAgeCategory(member.yearOfBirth)] || "-"}</td>
                                </>
                            )}

                            <td>{ member.roles.map(r => EnumMap[r] || r).join(", ") }</td>

                            <td className={styles.actionCell}>
                                <div className={styles.actionBadges}>
                                    <div className={styles.badge} title="View Scores">
                                        <button onClick={() => handleViewScores(member)} className={styles.invisibleButton}>
                                            <Info />
                                        </button>
                                    </div>

                                    {(isAdmin || isCaptain) && (
                                        <div className={styles.badge}  title="View Emergency Contacts">
                                            <button onClick={() => handleViewContacts(member)} className={styles.invisibleButton}>
                                                <Siren />
                                            </button>
                                        </div>
                                    )}

                                    {( isAdmin ) && (
                                        <>
                                            <div className={styles.badge} title="Edit User Information">
                                                <button onClick={() => handleEditMember(member)} className={styles.invisibleButton}>
                                                    <Pencil />
                                                </button>
                                            </div>

                                            <div className={`${styles.badge} ${styles.dangerBadge}`} title="End Membership">
                                                <button onClick={() => handleRemoveMember(member)} className={styles.invisibleButton}>
                                                    <Unlink />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            { error && <p className={"small centred error-message"}>{ error }</p> }
        </div>
    );
};

export default MembershipTable;
