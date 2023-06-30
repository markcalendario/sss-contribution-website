import { NonLoggedInPage } from "@/components/RouteProtections/RouteProtections";
import Disclaimer from "../../components/Disclaimer/Disclaimer";
import Footer from "../../components/Footer/Footer";
import Navbar from "../../components/Navbar/Navbar";

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
