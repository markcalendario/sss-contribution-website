import styles from "./Highlight.module.scss";

export default function Highlight(props) {
  const { tint, children } = props;

  return (
    <div className={styles.highlight + (tint ? " " + styles[tint] : "")}>
      <div className={styles.wrapper}>{children}</div>
    </div>
  );
}
