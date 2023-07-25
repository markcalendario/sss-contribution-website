"use client";

import { Fragment, useEffect, useState } from "react";
import Button from "../Buttons/Buttons";
import styles from "./Navbar.module.scss";

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(null);
  const links = [
    {
      name: "Sign In",
      link: "/login"
    },
    {
      name: "Sign Up",
      link: "/register"
    }
  ];

  const handleWindowResize = () => {
    setScreenWidth(window.innerWidth);
  };

  useEffect(() => {
    setScreenWidth(window.innerWidth);
    let resizeListener = window.addEventListener("resize", handleWindowResize);

    return () => {
      window.removeEventListener(resizeListener, handleWindowResize);
    };
  }, []);

  if (screenWidth <= 768) {
    return <SmallScreenNavbar links={links} />;
  }

  return <LargeScreenNavbar links={links} />;
}

function LargeScreenNavbar(props) {
  const { links } = props;

  return (
    <nav id={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <a href="/" className={styles.brand}>
            <div className={styles.logoContainer}>
              <img src="/images/logos/logo-original.webp" alt="SSS logo" />
            </div>
            <div className={styles.texts}>
              <h1>Social Security System</h1>
              <p>Republic of the Philippines</p>
            </div>
          </a>
          <div className={styles.links}>
            {links.map((value, index) => (
              <a key={index} href={`${value.link}`}>
                {value.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

function SmallScreenNavbar(props) {
  const { links } = props;
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerTriggerClick = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <nav id={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <a href="/" className={styles.brand}>
              <div className={styles.logoContainer}>
                <img src="/images/logos/logo-original.webp" alt="SSS logo" />
              </div>
              <div className={styles.texts}>
                <h1>Social Security System</h1>
                <p>Republic of the Philippines</p>
              </div>
            </a>
            <Button
              onClick={handleDrawerTriggerClick}
              className={styles.drawerButton + " bg-primary text-slate"}>
              <i className="fas fa-bars fa-fw"></i>
            </Button>
          </div>
        </div>
      </nav>
      {isDrawerOpen ? (
        <Drawer links={links} handleDrawerTriggerClick={handleDrawerTriggerClick} />
      ) : null}
    </Fragment>
  );
}

function Drawer(props) {
  const { handleDrawerTriggerClick, links } = props;

  return (
    <div data-aos="fade-left" className={styles.drawer}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.closeButtonContainer}>
            <Button
              onClick={handleDrawerTriggerClick}
              className={styles.closeButton + " bg-red text-slate"}>
              <i className="fas fa-times fa-fw"></i>
            </Button>
          </div>
          <div className={styles.brand}>
            <h1>Social Security System</h1>
          </div>
          <div className={styles.links}>
            {links.map((value, index) => (
              <a key={index} href={`${value.link}`}>
                {value.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
