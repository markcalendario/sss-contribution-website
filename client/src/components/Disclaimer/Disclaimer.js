import styles from "./Disclaimer.module.scss";

export default function Disclaimer() {
  return (
    <section id={styles.disclaimer}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <p>
            This is not a legitimate website of Social Security System. This
            website is intended solely for educational purposes only.
          </p>
          <p>
            Some images in this website are belong to the Social Security System
            webpage.
          </p>
        </div>
      </div>
    </section>
  );
}
