import styles from "./SectionContent.module.scss";

export default function SectionContent(props) {
  const { id, className, children } = props;

  return (
    <section id={id} className={styles.section + (className ? " " + className : "")}>
      <div className={styles.container}>{children}</div>
    </section>
  );
}

export function SectionTitle(props) {
  const { id, className, children } = props;

  if (!children) {
    throw new Error(
      "Title and/or description are required. H1 for title and P tag for description."
    );
  }

  return (
    <div id={id} className={styles.title + (className ? " " + className : "")}>
      <div className={styles.titleWrapper}>{children}</div>
    </div>
  );
}

export function SectionWrapper(props) {
  const { id, className, children } = props;

  if (!children) {
    throw new Error("Content is required.");
  }

  return (
    <div id={id} className={styles.wrapper + (className ? " " + className : "")}>
      {children}
    </div>
  );
}
