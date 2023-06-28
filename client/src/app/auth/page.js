"use client";

import { useCallback, useEffect } from "react";
import { FullPageLoader } from "../../components/Loaders/Loaders.js";

export default function Auth() {
  // if auth, get role
  // 		if role is employer go to /dashboard/employer
  // 		else if role is individual go to /dashboard/individual
  // else if not auth, go to /

  const getRole = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/accounts/role`, {
      credentials: "include"
    });

    if (!response.ok) {
      return (window.location.href = "/");
    }

    const result = await response.json();

    if (!result.success) {
      return (window.location.href = "/");
    }

    if (result.role === "individual") {
      return (window.location.href = "/dashboard/member");
    }

    if (result.role === "employer") {
      return (window.location.href = "/dashboard/employer");
    }
  };

  useEffect(() => {
    getRole();
  }, []);

  return <FullPageLoader text="Authenticating" />;
}
