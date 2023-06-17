import styles from "./Welcomer.module.scss";

export default function Welcomer(props) {
  const { id, className } = props;

  return (
    <div id={id} className={styles.welcomer + (className ? " " + className : "")}>
      <div className={styles.wrapper}>
        <p>Welcome</p>
        <h1>Mark Kenneth Calendario</h1>
        <p>You are logged in as a member.</p>
      </div>
    </div>
  );
}
