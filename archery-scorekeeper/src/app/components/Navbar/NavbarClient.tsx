"use client";

import { APP_NAME } from "@/app/lib/constants";
import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import clsx from "clsx";
import styles from "./Navbar.module.css";
import { HiMenu, HiOutlineChevronDown  } from "react-icons/hi";

const NAVIGATION_LINKS = [
  { href: "/", label: "Landing" },
  { href: "/dashboard", label: "Dashboard" },
  { href: "/1", label: "Placeholder 1" },
  { href: "/2", label: "Placeholder 2" },
  { href: "/3", label: "Placeholder 3" },
];

const NavbarClient = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

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
      </div>
    </nav>
  );
};

export default NavbarClient;
