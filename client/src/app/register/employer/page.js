import { Fragment } from "react";
import Navbar from "../../components/Navbar/Navbar";
import styles from "../register.shared.module.scss";

export default function RegisterPage() {
  return (
    <Fragment>
      <Register />
    </Fragment>
  );
}

function Register() {
  return (
    <section id={styles.register}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.registerBox}></div>
        </div>
      </div>
    </section>
  );
}
