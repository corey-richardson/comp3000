import { ChevronRight, Home } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

import styles from "./Breadcrumbs.module.css";

const Breadcrumbs = ({ customLabel }) => {
    const location = useLocation();
    const pathnames = location.pathname.split("/").filter(Boolean);

    const { fromClub, clubName } = location.state || {};

    const explicitDisabled = ["edit", "emergency-contacts"];

    return (
        <nav className={styles.nav} aria-label="Breadcrumbs">
            <ol className={styles.list}>
                <li className={styles.item}>
                    <Link to="/" className={styles.homeIcon}>
                        <Home size={22} />
                    </Link>
                </li>

                {pathnames.map((value, index) => {
                    const isLast = index === pathnames.length - 1;
                    const isClickable = !explicitDisabled.includes(value) && !isLast;

                    // DEFAULTS
                    let to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    let label = (isLast && customLabel) ? customLabel : value.replace(/-/g, " ");
                    // MEMORY STATE FROM LINK
                    if ((fromClub && value === "members") || value === fromClub) {
                        to = `/clubs/${fromClub}`;
                        label = clubName || "Club";
                    }

                    return (
                        <li key={to} className={styles.item}>
                            <ChevronRight className={styles.seperator} />

                            {!isClickable ? (
                                <span className={isLast ? styles.current : styles.disabledText}>{label}</span>
                            ) : (
                                <Link to={to} className={styles.link}>{label}</Link>
                            )}
                        </li>
                    );
                })}
            </ol>
        </nav>
    );
};

export default Breadcrumbs;

/**
 * ARIA Authoring Practices Guide (APG)
 * https://www.w3.org/WAI/ARIA/apg/patterns/breadcrumb/examples/breadcrumb/
 */
