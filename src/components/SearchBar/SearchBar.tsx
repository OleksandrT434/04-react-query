import css from './SearchBar.module.css';
import { toast } from 'react-hot-toast';


interface Props {
  onSubmit: (query: string) => void;
}

export default function SearchBar({ onSubmit }: Props) {
  async function handleSubmit(formData: FormData) {
    const query = formData.get('query')?.toString().trim() || '';
    if (query === "") {
      toast.error('Please enter a search query');
      return;
    }
    onSubmit(query);
  }


  return (
    <div className={css.container}>
      <header className={css.header}>
        <a className={css.link}
          href="https://www.themoviedb.org/"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by TMDB
        </a>
        <form action={handleSubmit} className={css.form}>
          <input
            className={css.input}
            type="text"
            name="query"
            autoComplete="off"
            placeholder="Search movies..."
            autoFocus
          />
          <button
            aria-label="button search"
            className={css.button}
            type="submit"
          >
            Search
          </button>
        </form>
      </header>
    </div>
  );
}