"use client";

import Button from "../Buttons/Buttons";
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
            <a href="/login/member">Member</a>
            <a href="/login/employer">Employer</a>
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
      {isDrawerOpen ? <Drawer handleDrawerTriggerClick={handleDrawerTriggerClick} /> : null}
    </Fragment>
  );
}

function Drawer(props) {
  const { handleDrawerTriggerClick } = props;

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
            <a href="/login/member">Member</a>
            <a href="/login/employer">Employer</a>
            <a href="/register">Sign Up</a>
          </div>
        </div>
      </div>
    </div>
  );
}
