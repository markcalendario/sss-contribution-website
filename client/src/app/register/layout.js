import { Fragment } from "react";
import Navbar from "../components/Navbar/Navbar";

export default function RegisterPagesLayout({ children }) {
  return (
    <Fragment>
      <Navbar />
      {children}
    </Fragment>
  );
}
