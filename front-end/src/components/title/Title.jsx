import style from "./Title.module.css";

export function Title({ children }) {
    return <p className={style.title}>{children}</p>;
}
