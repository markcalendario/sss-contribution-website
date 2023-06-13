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

export function LinkButton(props) {
  const { className, id, href, onClick, children } = props;

  return (
    <a
      className={(className ? className + " " : "") + styles.button}
      id={id}
      href={href}
      onClick={onClick}>
      {children}
    </a>
  );
}
