"use client";

import styles from "./Navbar.module.scss";
import { Fragment, useEffect, useState } from "react";

export default function Navbar() {
  const [screenWidth, setScreenWidth] = useState(null);

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
    return <SmallScreenNavbar />;
  }

  return <LargeScreenNavbar />;
}

function LargeScreenNavbar() {
  return (
    <nav id={styles.navbar}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.brand}>
            <div className={styles.logoContainer}>
              <img src="/images/logos/logo-original.webp" alt="SSS logo" />
            </div>
            <div className={styles.texts}>
              <h1>Social Security System</h1>
              <p>Republic of the Philippines</p>
            </div>
          </div>
          <div className={styles.links}>
            <a href="/individual">Member</a>
            <a href="/employer">Employer</a>
            <a href="/register">Sign Up</a>
          </div>
        </div>
      </div>
    </nav>
  );
}

function SmallScreenNavbar() {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleDrawerTriggerClick = () => {
    setIsDrawerOpen((prev) => !prev);
  };

  return (
    <Fragment>
      <nav id={styles.navbar}>
        <div className={styles.container}>
          <div className={styles.wrapper}>
            <div className={styles.brand}>
              <div className={styles.logoContainer}>
                <img src="/images/logos/logo-original.webp" alt="SSS logo" />
              </div>
              <div className={styles.texts}>
                <h1>Social Security System</h1>
                <p>Republic of the Philippines</p>
              </div>
            </div>
            <button onClick={handleDrawerTriggerClick} className={styles.drawerButton}>
              <i className="fas fa-bars fa-fw"></i>
            </button>
          </div>
        </div>
      </nav>
      {isDrawerOpen ? <Drawer handleDrawerTriggerClick={handleDrawerTriggerClick} /> : null}
    </Fragment>
  );
}

function Drawer(props) {
  const { handleDrawerTriggerClick } = props;

  return (
    <div className={styles.drawer}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.closeButtonContainer}>
            <button onClick={handleDrawerTriggerClick} className={styles.closeButton}>
              <i className="fas fa-times fa-fw"></i>
            </button>
          </div>
          <div className={styles.brand}>
            <h1>Social Security System</h1>
          </div>
          <div className={styles.links}>
            <a href="/individual">Member</a>
            <a href="/employer">Employer</a>
            <a href="/register">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
