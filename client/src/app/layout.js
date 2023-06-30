"use client";

import AOS from "aos";
import "aos/dist/aos.css";
import { useEffect } from "react";
import "../styles/fontawesome/css/all.min.css";
import "../styles/main.scss";

export const metadata = {
  title: "SSS Contribution",
  description: "Web-based SSS Contribution Form"
};

export default function RootLayout({ children }) {
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 500,
      delay: 0,
      easing: "ease"
    });
  });

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
