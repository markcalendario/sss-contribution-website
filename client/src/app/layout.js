"use client";

import "../styles/main.scss";
import "../styles/fontawesome/css/all.min.css";
import "aos/dist/aos.css";
import AOS from "aos";
import Footer from "../components/Footer/Footer";
import Disclaimer from "../components/Disclaimer/Disclaimer";
import { useEffect } from "react";

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
