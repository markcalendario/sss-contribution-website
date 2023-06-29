"use client";

import { Fragment, useEffect, useState } from "react";
import Button from "../../components/Buttons/Buttons";
import styles from "./layout.module.scss";
import { usePathname } from "next/navigation";

export default function Layout({ children }) {
  return <Fragment>{children}</Fragment>;
}

export function DashboardLayout({ children }) {
  return <div id={styles.dashboard}>{children}</div>;
}

export function Navigations({ asideLinks }) {
  const [isAsideOpen, setIsAsideOpen] = useState(false);

  useEffect(() => {
    setIsAsideOpen(() => {
      return window.innerWidth <= 768 ? false : true;
    });
  }, []);

  const toggleAsideState = () => {
    setIsAsideOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <Navbar toggleAsideState={toggleAsideState} />
      {isAsideOpen ? <Aside asideLinks={asideLinks} /> : null}
    </Fragment>
  );
}

export function Main({ children }) {
  return (
    <main id={styles.main}>
      <div className={styles.container}>{children}</div>
    </main>
  );
}

export function AsideLink(props) {
  const { icon, href, children } = props;
  const pathName = usePathname();
  const isActive = href === pathName;

  return (
    <a className={styles.asideLink + (isActive ? " " + styles.active : "")} href={href}>
      {icon ? <i className={icon + " fa-fw"} /> : null} <span>{children}</span>
    </a>
  );
}

export function Aside({ asideLinks }) {
  return (
    <aside id={styles.aside} data-aos="fade-right">
      <div className={styles.wrapper}>
        {asideLinks.map((asideLink) => (
          <AsideLink key={asideLink.link} href={asideLink.link} icon={asideLink.icon}>
            {asideLink.title}
          </AsideLink>
        ))}
      </div>
    </aside>
  );
}

function Navbar({ toggleAsideState }) {
  const signOut = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      credentials: "include",
      method: "delete"
    });

    window.location.href = "/";
  };

  return (
    <nav id={styles.nav}>
      <div className={styles.wrapper}>
        <div className={styles.left}>
          <Button
            className={styles.asideTogglerBtn + " bg-transparent text-primary"}
            onClick={toggleAsideState}>
            <i className="fa fa-bars fa-fw" />
          </Button>
          <div className={styles.brandImage}>
            <img src="/images/logos/logo-original.webp" alt="SSS logo" />
          </div>
        </div>
        <div className={styles.right}>
          <Button onClick={signOut} className="bg-transparent text-red">
            <i className="fa fa-sign-out"></i>
          </Button>
        </div>
      </div>
    </nav>
  );
}

export function DashboardContent(props) {
  const { children, id, className } = props;
  return (
    <div id={id} className={styles.dashboardContent + (className ? " " + className : "")}>
      {children}
    </div>
  );
}

export function DashboardTitle({ children }) {
  return <div className={styles.title}>{children}</div>;
}

export function Content(props) {
  const { children, id, className } = props;
  return (
    <div id={id} className={styles.content + (className ? " " + className : "")}>
      {children}
    </div>
  );
}
