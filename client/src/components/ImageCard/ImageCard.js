import styles from "./ImageCard.module.scss";

export default function ImageCard(props) {
  const { id, className, imageLink, onClick, title, description } = props;

  if (!title && !description) {
    throw Error("Title and/or description property values must be provided");
  }

  return (
    <div
      id={id}
      onClick={onClick}
      className={
        styles.imageCard +
        (className ? " " + className : "") +
        (onClick ? " " + styles.clickableEffect : "")
      }>
      <div className={styles.imageContainer}>
        <img src={imageLink} alt={title} />
      </div>
      <div className={styles.textsContainer}>
        {title ? <h1>{title}</h1> : null}
        {description ? <p>{description}</p> : null}
      </div>
    </div>
  );
}
