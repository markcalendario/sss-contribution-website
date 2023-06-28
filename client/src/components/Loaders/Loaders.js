import styles from "./Loaders.module.scss";

export function FullPageLoader({ text }) {
  return (
    <div id={styles.fullPageLoader}>
      <div data-aos="fade-up" className={styles.content}>
        <img src="/images/logos/logo-original.webp" alt="SSS Logo" />
        {text ? <p>{text}</p> : null}
      </div>
    </div>
  );
}
