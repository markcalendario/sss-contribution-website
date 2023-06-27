"use client";

import { useCallback, useEffect, useState } from "react";
import { FullPageLoader } from "../Loaders/Loaders";

export function NonLoggedInPage(props) {
  // If auth, send to /auth
  // If not auth, render

  const { children: Component } = props;

  const [isAuth, setIsAuth] = useState(null);

  const checkAuthState = useCallback(async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/is-auth`, {
      credentials: "include"
    });
    const result = await response.json();
    const { isAuth } = result;

    if (isAuth) {
      return setIsAuth(true);
    }

    setIsAuth(false);
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  if (isAuth) {
    return (window.location.href = "/auth");
  }

  if (isAuth === null) {
    return <FullPageLoader />;
  }

  return Component;
}
