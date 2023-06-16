"use client";

import { useEffect, useState } from "react";
import Button from "../components/Buttons/Buttons";
import styles from "./layout.module.scss";
import { usePathname } from "next/navigation";

export default function DashboardLayout({ children }) {
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
    <div id={styles.dashboard}>
      <Navbar toggleAsideState={toggleAsideState} />
      {isAsideOpen ? <Aside /> : null}
      <Main>{children}</Main>
    </div>
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

export function Aside() {
  const [memberType, setMemberType] = useState("member");

  const asideLinks = [
    {
      link: `/dashboard/${memberType}`,
      icon: "fa fa-home",
      title: "Home"
    },
    {
      link: `/dashboard/${memberType}/history`,
      icon: "fa fa-history",
      title: "Contribution History"
    },
    {
      link: `/dashboard/${memberType}/contribute`,
      icon: "fa fa-file",
      title: "File a Contribution"
    },
    {
      link: `/dashboard/${memberType}/pay`,
      icon: "fa fa-hourglass-half",
      title: "Pending Payment"
    }
  ];

  return (
    <aside id={styles.aside} data-aos="fade-right">
      <div className={styles.wrapper}>
        {asideLinks.map((asideLink) => (
          <AsideLink href={asideLink.link} icon={asideLink.icon}>
            {asideLink.title}
          </AsideLink>
        ))}
      </div>
    </aside>
  );
}

function Navbar({ toggleAsideState }) {
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
          <p className={styles.userName}>Mark Kenneth Calendario</p>
          <div className={styles.userImage}>
            <img
              src="https://imageio.forbes.com/specials-images/imageserve/513343414/0x0.jpg?format=jpg&width=1200"
              alt="user"
            />
          </div>
        </div>
      </div>
    </nav>
  );
}
