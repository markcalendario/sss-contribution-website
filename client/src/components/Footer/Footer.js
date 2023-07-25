import styles from "./Footer.module.scss";

export default function Footer() {
  return (
    <footer id={styles.footer}>
      <div className={styles.container}>
        <div className={styles.wrapper}>
          <div className={styles.column}>
            <div className={styles.contentBlock}>
              <div className={styles.logoContainer}>
                <img src="/images/logos/logo-original.webp" alt="SSS" />
              </div>
              <h1 className={styles.title}>Social Security System</h1>
              <p>Republic of the Philippines</p>
            </div>
            <div className={styles.contentBlock}>
              <a href="https://github.com/markcalendario/sss-contribution-website">
                <i className="fab fa-github"></i> Visit this project.
              </a>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.contentBlock}>
              <h1 className={styles.title}>Developers</h1>
              <div className={styles.content}>
                <a href="https://markkennethcalendario.web.app">Calendario, Mark Kenneth</a>
                <p>Levardo, John Race</p>
                <p>Ong, Zoe Tatianna</p>
                <p>Yim, Gwyneth Anmarie</p>
              </div>
            </div>
          </div>

          <div className={styles.column}>
            <div className={styles.contentBlock}>
              <h1 className={styles.title}>Technologies Used</h1>
              <div className={styles.content}>
                <p>Next JS &ndash; User Interface</p>
                <p>Express JS &ndash; Backend</p>
                <p>Node JS &ndash; Development Environment</p>
                <p>MySQL &ndash; Database</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
