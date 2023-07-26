import styles from "./Table.module.scss";

export function VerticalTable({ children }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table + " " + styles.verticalTable}>
        {children}
      </table>
    </div>
  );
}

export function HorizontalTable({ children }) {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table + " " + styles.horizontalTable}>
        {children}
      </table>
    </div>
  );
}
