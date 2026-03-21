import { AlertTriangle } from "lucide-react";

import styles from "./DeleteOverlay.module.css";

const DeleteOverlay = ({
    message,
    onConfirm,
    onCancel,
    isPending,
    confirmButtonText = "Delete",
    confirmButtonTextAction = "Deleting",
    type = "card"
}) => {

    let overlayClass;

    switch (type) {
        case "row":
            overlayClass = styles.rowOverlay;
            break;
        default:
            overlayClass = styles.cardOverlay;
    }

    return (
        <div className={overlayClass}>

            <AlertTriangle />
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
