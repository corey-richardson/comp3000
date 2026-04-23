import { Trash2 } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import dangerStyles from "./ClubDangerZone.module.css";
import DeleteOverlay from "../../components/DeleteOverlay/DeleteOverlay";
import { useApi } from "../../hooks/useApi";

const ClubDangerZone = ({ clubId, clubName }) => {

    const { makeApiCall } = useApi();
    const navigate = useNavigate();

    const [ isDeleting, setIsDeleting ] = useState(false);
    const [ showOverlay, setShowOverlay ] = useState(false);
    const [ error, setError ] = useState(null);

    const handleDelete = async () => {
        console.log("Deleting " + clubName);
    };

    return (
        <div className={dangerStyles.dangerZone}>
            <hr className={dangerStyles.divider} />

            <h3 className={dangerStyles.title}>Admin Only Danger Zone</h3>

            <div className={dangerStyles.box}>
                <div>
                    <strong>Delete this club</strong>
                    <p>This is a destructive action, there is no going back. Please be certain.</p>
                    {error && <p className="error-message">{error}</p>}
                </div>

                <button
                    className={dangerStyles.deleteButton}
                    onClick={() => setShowOverlay(true)}
                >
                    <Trash2 /> Delete Club
                </button>

                {showOverlay && (
                    <DeleteOverlay
                        message={`Are you sure you want to delete ${clubName}? This action is irreversible.`}
                        onConfirm={handleDelete}
                        onCancel={() => setShowOverlay(false)}
                        isPending={isDeleting}
                        confirmButtonText="Yes, Delete Club"
                        confirmButtonTextAction="Deleting"
                        type="card"
                    />
                )}
            </div>
        </div>
    );
};

export default ClubDangerZone;
