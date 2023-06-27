import styles from "./Loaders.module.scss";

export function FullPageLoader() {
  return (
    <div id={styles.fullPageLoader}>
      <img data-aos="fade-up" src="/images/logos/logo-original.webp" alt="SSS Logo" />
    </div>
  );
}
