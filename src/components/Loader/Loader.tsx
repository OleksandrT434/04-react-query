import css from './Loader.module.css';


export function Loader() {
    return (
        <p className={css.text}>Loading movies, please wait...</p>
    )
}