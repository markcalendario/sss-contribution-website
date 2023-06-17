import styles from "./Table.module.scss";

export function VerticalTable({ children }) {
  return (
    <table id={styles.table} className={styles.verticalTable}>
      {children}
    </table>
  );
}

export function HorizontalTable({ children }) {
  return (
    <table id={styles.table} className={styles.horizontalTable}>
      {children}
    </table>
  );
}
