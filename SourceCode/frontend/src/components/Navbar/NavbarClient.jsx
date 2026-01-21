"use client";

import clsx from "clsx";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { HiMenu, HiOutlineChevronDown  } from "react-icons/hi";

import { APP_NAME } from "@/app/lib/constants";
import { supabase } from "@/app/utils/supabase/client";

import styles from "./Navbar.module.css";


const NAVIGATION_LINKS = [
    { href: "/dashboard", label: "Dashboard" },
    // { href: "/1", label: "Placeholder 1" },
    // { href: "/2", label: "Placeholder 2" },
    // { href: "/3", label: "Placeholder 3" },
];

const NavbarClient = () => {
    const router = useRouter();

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const pathname = usePathname();

    const handleSignout = async () => {
        await supabase.auth.signOut();
        router.push("/");
    }

    return (
        <nav className={styles.navbar}>
            <h1>{APP_NAME}</h1>

            <button
                className={styles.burger}
                aria-label="Toggle menu"
                onClick={() => setIsMenuOpen((open) => !open)}
            >
                {isMenuOpen ? <HiOutlineChevronDown className={styles.burgerIcon} /> : <HiMenu className={styles.burgerIcon} />}
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
};

export default NavbarClient;
