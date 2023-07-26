import styles from "./FormFields.module.scss";

export function Input(props) {
  const {
    id,
    className,
    name,
    placeholder,
    preview,
    type,
    required,
    defaultValue,
    value,
    onChange,
    readOnly
  } = props;

  const unacceptedInputType = ["checkbox", "radio"];
  if (unacceptedInputType.includes(type)) {
    throw new Error(`Unacceptable input type. Use <Checkbox/> or <Radio/>.`);
  }

  return (
    <div className={styles.regularFields + (className ? " " + className : "")}>
      {placeholder ? (
        <p className={styles.placeholder}>
          {placeholder}{" "}
          {required ? <span className={styles.requiredStar}>*</span> : null}
        </p>
      ) : null}
      <input
        id={id}
        placeholder={preview}
        defaultValue={defaultValue}
        value={value}
        readOnly={readOnly}
        name={name}
        type={type}
        onChange={onChange}
      />
    </div>
  );
}

export function Select(props) {
  const {
    id,
    className,
    name,
    placeholder,
    required,
    onChange,
    value,
    children
  } = props;

  return (
    <div className={styles.regularFields + (className ? " " + className : "")}>
      {placeholder ? (
        <p className={styles.placeholder}>
          {placeholder}{" "}
          {required ? <span className={styles.requiredStar}>*</span> : null}
        </p>
      ) : null}
      <select id={id} name={name} value={value} onChange={onChange}>
        {children}
      </select>
    </div>
  );
}

export function Checkbox(props) {
  const { children, onChange, checked } = props;
  return (
    <label className={styles.checkbox}>
      <input type="checkbox" checked={checked} onChange={onChange} />
      <div className={styles.box}></div>
      <p>{children}</p>
    </label>
  );
}
