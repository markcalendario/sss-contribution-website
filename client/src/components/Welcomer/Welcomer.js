import styles from "./Welcomer.module.scss";

export default function Welcomer(props) {
  const { id, className, role, name } = props;

  return (
    <div
      id={id}
      className={styles.welcomer + (className ? " " + className : "")}>
      <div className={styles.wrapper}>
        <p>Welcome</p>
        <h1>{name}</h1>
        <p>You are logged in as an {role}.</p>
      </div>
    </div>
  );
}
