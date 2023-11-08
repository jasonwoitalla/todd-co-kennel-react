'use client'

import Link from "next/link";
import styles from "./header.module.scss";
import { MenuItem } from "@/lib/fetcher";
import Image from "next/image";
import { useState } from "react";
import { usePathname } from "next/navigation";

export interface Props {
    menuItems: MenuItem[];
}

export default function Header(props: Props) {
    const [active, setActive] = useState(false);
    const pathname = usePathname();
    console.log("Pathname: " + pathname);

    const siteLogo = process.env.WORDPRESS_URL + "/wp-content/uploads/2018/12/Logo-main.png";

    function sanatizeMenuPath(menuItemPath) {
        if(!menuItemPath) {
            return "invalidpathnamethisshouldnevermatch";
        }

        console.log("Menu path: " + menuItemPath.replaceAll("/", ""));
        return menuItemPath.replaceAll("/", "");
    }

    return (
        <header className={`header ${styles.header}`}>
            <nav className={`navbar ${styles.navigation}`} role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <Link href="/" className={styles.logo}>
                        <img src={siteLogo} alt="Todd Co Kennel Logo" width={164} height={46} />
                    </Link>

                    <button role="button" className={`navbar-burger ${active ? "is-active" : ""}`} aria-label="menu" aria-expanded="false" onClick={() => setActive(!active)}>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </button>
                </div>

                <div className={`navbar-menu ${active ? "is-active" : ""}`}>
                    <div className="navbar-end">
                        {props.menuItems.map(menuItem => (
                            <Link key={menuItem.id} className={`navbar-item ${styles.linkText} ${pathname.includes(sanatizeMenuPath(menuItem.path)) ? "is-active" : ""}`} href={menuItem.path == null ? "/" : menuItem.path}>
                                {menuItem.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </nav>
            <ul className={styles.navList}>
                
            </ul>
        </header>
    )
}
