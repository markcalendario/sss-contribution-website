import { Fragment } from "react";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import Disclaimer from "../../components/Disclaimer/Disclaimer";

export default function RegisterLayout({ children }) {
  return (
    <Fragment>
      <Navbar />
      {children}
      <Footer />
      <Disclaimer />
    </Fragment>
  );
}
