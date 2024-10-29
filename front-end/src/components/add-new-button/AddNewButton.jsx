import styles from "./AddNewButton.module.css";

export function AddNewButton({ children }) {
    return <button className={styles["add-new-button"]}>{children}</button>;
}
