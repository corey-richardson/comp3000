import { Shield } from "lucide-react";

import styles from "./RoleSelection.module.css";
import EnumMap from "../../lib/enumMap";
import formStyles from "../../styles/Forms.module.css";

const ROLES = [ "ADMIN", "CAPTAIN", "COACH", "RECORDS" ];

const RoleSelection = ({ selectedRoles, onRoleChange, isDisabled=false }) => {
    return (
        <div className={styles.roleSelection}>
            <label className={formStyles.labelWithIcon}>
                <Shield />
                Assign Roles:
            </label>

            <div className={styles.roleCheckboxGroup}>
                <label className={styles.checkboxLabel}>
                    <input
                        type="checkbox"
                        checked
                        readOnly
                        disabled={isDisabled}
                    />
                    <span>{ EnumMap["MEMBER"] }</span>
                </label>

                {ROLES.map((role) => (
                    <label
                        key={role}
                        className={styles.checkboxLabel}
                    >
                        <input
                            type="checkbox"
                            checked={ selectedRoles.includes(role) }
                            onChange={ () => onRoleChange(role) }
                            disabled={isDisabled}
                        />
                        { EnumMap[role] }
                    </label>
                ))}

            </div>
        </div>
    );
};

export default RoleSelection;
