"use client";

import { useEffect, useState } from "react";
import { FullPageLoader } from "../Loaders/Loaders";
import { useRouter } from "next/navigation";

export function NonLoggedInPage({ children: Component }) {
  // If auth, send to /auth
  // If not auth, render

  const [isAuth, setIsAuth] = useState(null);

  const checkAuthState = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/is-auth`, {
      credentials: "include"
    });
    const result = await response.json();
    const { isAuth } = result;

    if (isAuth) {
      return (window.location.href = "/auth");
    }

    setIsAuth(false);
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  if (isAuth === null) {
    return <FullPageLoader />;
  }

  if (isAuth === false) {
    return Component;
  }
}

export function LoggedInPageProtection({ children: Component }) {
  // If auth, render
  // If not auth, go to landing page

  const [isAuth, setIsAuth] = useState(null);

  const checkAuthState = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/is-auth`, {
      credentials: "include"
    });
    const result = await response.json();
    const { isAuth } = result;

    if (!isAuth) {
      return (window.location.href = "/");
    }

    setIsAuth(true);
  };

  useEffect(() => {
    checkAuthState();
  }, []);

  if (isAuth === null) {
    return <FullPageLoader />;
  }

  if (isAuth === true) {
    return Component;
  }
}

export function MemberPageProtection({ children: Component }) {
  // If individual member, render
  // If not, go to /auth

  const [isMember, setIsMember] = useState(null);

  const checkRole = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/role`, {
      credentials: "include"
    });

    const result = await response.json();
    const { role } = result;

    if (role !== "individual") {
      return (window.location.href = "/auth");
    }

    setIsMember(true);
  };

  useEffect(() => {
    checkRole();
  }, []);

  if (isMember === null) {
    return <FullPageLoader />;
  }

  if (isMember === true) {
    return Component;
  }
}

export function EmployerPageProtection({ children: Component }) {
  // If employer member, render
  // If not, go to /auth

  const [isEmployer, setIsEmployer] = useState(null);

  const checkRole = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/role`, {
      credentials: "include"
    });
    const result = await response.json();
    const { role } = result;

    if (role !== "employer") {
      return (window.location.href = "/auth");
    }

    setIsEmployer(true);
  };

  useEffect(() => {
    checkRole();
  }, []);

  if (isEmployer === null) {
    return <FullPageLoader />;
  }

  if (isEmployer === true) {
    return Component;
  }
}
