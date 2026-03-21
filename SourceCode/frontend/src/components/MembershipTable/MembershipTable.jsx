import { Info, Siren, Pencil, Unlink } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import { useApi } from "../../hooks/useApi";
import { useAuthContext } from "../../hooks/useAuthContext";
import calculateAgeCategory from "../../lib/calculateAgeCategory";
import EnumMap from "../../lib/enumMap";
import styles from "../../styles/Tables.module.css";
import DeleteOverlay from "../DeleteOverlay/DeleteOverlay";

const MembershipTable = ({ members: initialMemberState = [], clubName, decrementMemberCount }) => {

    const [ members, setMembers ] = useState(initialMemberState);
    const [ error, setError ] = useState(null);

    const [ memberToDelete, setMemberToDelete ] = useState(null);
    const [ isPendingDeletion, setIsPendingDeletion ] = useState(false);

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

    const confirmDeletion = async (member) => {
        if (!memberToDelete) {
            return;
        }

        try {
            setIsPendingDeletion(true);
            setError(null);

            const response = await makeApiCall(`/api/clubs/memberships/${memberToDelete.id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error);
            }

            setMembers(prev => prev.filter(m => m.id !== member.id));
            setMemberToDelete(null);
        } catch (error) {
            setError(`Failed to remove member ${member.firstName} ${member.lastName}: ${error.message}`);
        } finally {
            setIsPendingDeletion(false);
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
                        <tr key={member.id} style={{ position: "relative" }}>
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
                                        <Link
                                            to={`/clubs/members/${member.userId}`}
                                            state={{ fromClub: member.clubId, clubName }}
                                            className={styles.invisibleButton}
                                        >
                                            <Info />
                                        </Link>
                                    </div>

                                    {(isAdmin || isCaptain) && (
                                        <div className={styles.badge}  title="View Emergency Contacts">
                                            <Link
                                                to={`/clubs/members/emergency-contacts/${member.userId}`}
                                                state={{ fromClub: member.clubId, clubName }}
                                                className={styles.invisibleButton}
                                            >
                                                <Siren />
                                            </Link>
                                        </div>
                                    )}

                                    {isAdmin && (
                                        <>
                                            <div className={styles.badge} title="Edit User Information">
                                                <Link
                                                    to={`/clubs/members/edit/${member.userId}`}
                                                    state={{ fromClub: member.clubId, clubName }}
                                                    className={styles.invisibleButton}
                                                >
                                                    <Pencil />
                                                </Link>
                                            </div>

                                            <div className={`${styles.badge} ${styles.dangerBadge}`} title="End Membership">
                                                <button
                                                    onClick={() => setMemberToDelete(member)}
                                                    className={styles.invisibleButton}
                                                >
                                                    <Unlink />
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>

                                { memberToDelete?.id === member.id && (
                                    <DeleteOverlay
                                        type="row"
                                        message={`Are you sure you want to remove ${member.firstName} ${member.lastName} from this club?`}
                                        onConfirm={() => confirmDeletion(member)}
                                        onCancel={() => setMemberToDelete(null)}
                                        isPending={isPendingDeletion}
                                        confirmButtonText="Remove"
                                        confirmButtonTextAction="Removing"

                                    />
                                )}

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
