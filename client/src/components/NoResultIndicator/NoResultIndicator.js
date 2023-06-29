import styles from "./NoResultIndicator.module.scss";

export default function NoResultIndicator({ text }) {
  return (
    <div className={styles.noResultIndicator}>
      <div className={styles.illustrationContainer}>
        <img src="/images/illustrations/chick-eating-worm.svg" alt="chick" />
      </div>
      {text ? <p>{text}</p> : <p>Nothing to show here yet.</p>}
    </div>
  );
}
