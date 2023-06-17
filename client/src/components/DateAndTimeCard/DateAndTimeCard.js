import styles from "./DateAndTimeCard.module.scss";

export default function DateAndTimeCard(props) {
  const { id, className } = props;

  return (
    <div id={id} className={styles.dateTimeCard + (className ? " " + className : "")}>
      <div className={styles.wrapper}>
        <p>Tuesday</p>
        <h1>1:24 PM</h1>
        <p>June 17, 2023</p>
      </div>
    </div>
  );
}
