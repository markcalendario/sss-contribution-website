import "../styles/main.scss";
import "../styles/fontawesome/css/all.min.css";
import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Disclaimer from "./components/Disclaimer/Disclaimer";

export const metadata = {
  title: "SSS Contribution",
  description: "Web-based SSS Contribution Form"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Footer />
        <Disclaimer />
      </body>
    </html>
  );
}
