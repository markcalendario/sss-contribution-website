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

/**
 *
 * @param {*} props
 * Children must be a text only (including icon).
 * It cannot contain block level elements.
 * @returns JSX
 */

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
