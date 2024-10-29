import styles from "./ShortNote.module.css";

export function ShortNote({ note, active }) {
    return (
        <div
            className={[styles["short-note"], active ? styles.active : ""].join(
                " "
            )}
        >
            <div className={styles.title}>{note.title}</div>
            <div className={styles.body}>{note.body}</div>
        </div>
    );
}
