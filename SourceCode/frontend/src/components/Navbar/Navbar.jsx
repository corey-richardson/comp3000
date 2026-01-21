import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, ChevronDown } from "lucide-react";
import clsx from "clsx";

import useLogout from "../../hooks/useLogout";
import { useAuthContext } from "../../hooks/useAuthContext";
import styles from "./Navbar.module.css";

import { APP_NAME } from "../../lib/constants";

const NAVIGATION_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    // { href: "/1", label: "Placeholder 1" },
    // { href: "/2", label: "Placeholder 2" },
    // { href: "/3", label: "Placeholder 3" },
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
    }

    if (!user) {
        return (
            <nav className={styles.navbar}>
                <h1>{ APP_NAME }</h1>
            </nav>
        )
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
                                href={link.href}
                                className={clsx(styles.navLink, {
                                    [styles.active]: pathname === link.href,
                                })}
                                onClick={() => setTimeout(() => setIsMenuOpen(false), 300)}
                            >
                                {link.label}
                            </Link>
                        ))}
        
                        <button
                            className={styles.navLink}
                            onClick={handleSignout}
                        >
                  Sign Out
                        </button>
        
                    </div>
                </nav>
    );
}
 
export default Navbar;