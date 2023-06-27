"use client";

import Button, { LinkButton } from "@/components/Buttons/Buttons";
import { Input } from "@/components/FormFields/FormFields";
import styles from "./page.module.scss";
import { useEffect, useState } from "react";
import Navbar from "@/components/Navbar/Navbar";
import { NonLoggedInPage } from "@/components/RouteProtections/RouteProtections";
import Footer from "@/components/Footer/Footer";
import Disclaimer from "@/components/Disclaimer/Disclaimer";

export default function LoginCompiled() {
  return (
    <NonLoggedInPage>
      <Navbar />
      <MemberLogin />
      <Footer />
      <Disclaimer />
    </NonLoggedInPage>
  );
}

export function MemberLogin() {
  const [background, setBackground] = useState(null);
  const backgroundImages = ["login-banner-a.webp", "login-banner-b.webp"];

  useEffect(() => {
    const bgIndex = Math.floor(Math.random() * backgroundImages.length);
    setBackground(backgroundImages[bgIndex]);
  }, [backgroundImages]);

  const handleLogin = async () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    if (!response.ok) {
      return alert("An error occured while signing you in.");
    }

    const result = await response.json();

    if (!result.success) {
      return alert(result.message);
    }

    return (window.location.href = "/auth");
  };

  return (
    <section
      style={{ backgroundImage: `url(/images/banners/${background})` }}
      id={styles.login}
      className={styles.memberLogin}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <form className={styles.loginBox} onSubmit={(evt) => evt.preventDefault()}>
            <h1>Login</h1>
            <Input id="email" placeholder="Email Address" required />
            <Input id="password" type="password" placeholder="Pasword" required />
            <Button className="bg-primary text-slate" onClick={handleLogin}>
              Login your SSS acount.
            </Button>
            <LinkButton href="/register" className="bg-slate-2 text-slate-7">
              Don&apos;t have an account? Register here.
            </LinkButton>
          </form>
        </div>
      </div>
    </section>
  );
}
