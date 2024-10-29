import style from "./Layout.module.css";
export function Layout({ children }) {
    return <div className={style["flex-container"]}>{children}</div>;
}
