import { Fragment } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Disclaimer from "../../components/Disclaimer/Disclaimer";
import { NonLoggedInPage } from "@/components/RouteProtections/RouteProtections";

export default function RegisterLayout({ children }) {
  return (
    <NonLoggedInPage>
      <Navbar />
      {children}
      <Footer />
      <Disclaimer />
    </NonLoggedInPage>
  );
}
