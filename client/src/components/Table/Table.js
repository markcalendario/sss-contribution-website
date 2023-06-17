import styles from "./Table.module.scss";

export default function Table({ children }) {
  return <table id={styles.table}>{children}</table>;
}
