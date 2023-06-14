import styles from "./Buttons.module.scss";

export default function Button(props) {
  const { className, id, onClick, children } = props;

  return (
    <button
      className={(className ? className + " " : "") + styles.button}
      id={id}
      onClick={onClick}>
      {children}
    </button>
  );
}
