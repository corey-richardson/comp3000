import clsx from "clsx";
import { Menu, ChevronDown, BowArrow, CirclePlus, LogOut, UserRound } from "lucide-react";
import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import styles from "./Navbar.module.css";
import { useAuthContext } from "../../hooks/useAuthContext";
import useLogout from "../../hooks/useLogout";
import { APP_NAME } from "../../lib/constants";

const NAVIGATION_LINKS = [
    { href: "/dashboard", label: <><BowArrow size={20} />&nbsp; Dashboard</> },
    { href: "/my-scores", label: <><UserRound size={20} />&nbsp; My Scores</> },
    { href: "/submit-score", label: <><CirclePlus size={20} />&nbsp; Submit a Score</> },
];

const Navbar = () => {
    const { user } = useAuthContext();
    const { logout } = useLogout();
    const { pathname } = useLocation();
    const navigate = useNavigate();

    const [ isMenuOpen, setIsMenuOpen ] = useState(false);

    const handleSignout = () => {
        logout();
        setIsMenuOpen(false);
        navigate("/");
    };

    if (!user) {
        return (
            <nav className={styles.navbar}>
                <h1>{ APP_NAME }</h1>
            </nav>
        );
    }

    return (
        <nav className={styles.navbar}>
            <h1>{APP_NAME}</h1>

            <button
                className={styles.burger}
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                {isMenuOpen ? (
                    <ChevronDown size={24} className={styles.burgerIcon} />
                ) : (
                    <Menu size={24} className={styles.burgerIcon} />
                )}

            </button>

            <div
                className={clsx(styles.links, {
                    [styles.linksOpen]: isMenuOpen,
                })}
            >
                {NAVIGATION_LINKS.map((link) => (
                    <Link
                        key={link.href}
                        to={link.href}
                        className={clsx(styles.navLink, {
                            [styles.active]: pathname === link.href,
                        })}
                        onClick={() => setTimeout(() => setIsMenuOpen(false), 300)}
                    >
                        {link.label}
                    </Link>
                ))}

                <button
                    className={clsx(styles.navLink, styles.signoutButton)}
                    onClick={handleSignout}
                    title="Sign Out"
                >
                    <LogOut size={20}/>&nbsp;
                    <span className={styles.signoutText}>Sign Out</span>
                </button>

            </div>
        </nav>
    );
};

export default Navbar;
