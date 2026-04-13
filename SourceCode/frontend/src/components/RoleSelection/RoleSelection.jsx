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

                {ROLES.map((role) => {
                    const isSelected = selectedRoles.includes(role);

                    return (
                        <label
                            key={role}
                            className={styles.checkboxLabel}
                        >
                            <input
                                type="checkbox"
                                checked={ isSelected }
                                onChange={ () => onRoleChange(role) }
                                disabled={ isDisabled }
                            />
                            <span
                                className={ isSelected ? styles.activeRole : "" }
                            >
                                { EnumMap[role] }
                            </span>
                        </label>
                    );
                })}

            </div>
        </div>
    );
};

export default RoleSelection;
