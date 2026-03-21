import { AlertTriangle } from "lucide-react";

import styles from "../../styles/DeleteOverlay.module.css";

const DeleteOverlay = ({
    message,
    onConfirm,
    onCancel,
    isPending,
    confirmButtonText = "Delete",
    confirmButtonTextAction = "Deleting"
}) => {
    return (
        <div className={styles.overlay}>

            <AlertTriangle size={24} />
            <span className={styles.message}>{ message }</span>

            <div className={styles.buttonGroup}>
                <button
                    onClick={onConfirm}
                    disabled={isPending}
                    className={styles.confirmButton}
                >
                    { isPending ? `${confirmButtonTextAction}...` : confirmButtonText }
                </button>

                <button
                    onClick={onCancel}
                    disabled={isPending}
                    className={styles.cancelButton}
                >
                    Cancel
                </button>
            </div>
        </div>
    );
};

export default DeleteOverlay;
