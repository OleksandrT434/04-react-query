import css from './App.module.css';
import SearchBar from '../SearchBar/SearchBar';
import MovieGrid from '../MovieGrid/MovieGrid';
import type { Movie } from '../../types/movie';
import {fetchMovies} from '../../services/movieService';
import { useState } from 'react';
import { Toaster, toast } from 'react-hot-toast';
import MovieModal from '../MovieModal/MovieModal';
import { ErrorMessage } from '../ErrorMessage/ErrorMessage';
import { Loader } from '../Loader/Loader';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import ReactPaginate from 'react-paginate';



export default function App() {
    const [query, setQuery] = useState("");
    const [page, setPage] = useState(1); 
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const handleSearch = (newQuery: string) => {
        if (newQuery.trim() === '') {
          toast.error('Please enter a search query');
          return;
        }
        setQuery(newQuery);
        setPage(1);

    }
    const handleSelect = (movie: Movie): void => {
        setSelectedMovie(movie);
    }
    const { data, isLoading, error, isSuccess} = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies({ query, page }),
        enabled: query !== "",
        placeholderData: keepPreviousData,
        
    });
    const movies = data?.results ?? [];
    const totalPages = data?.total_pages ?? 0;
    
    return (
        <div className={css.app}>
            <SearchBar onSubmit={handleSearch} />
            {isSuccess && (
            <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                    renderOnZeroPageCount={null}
            />)}
            <Toaster position="top-center" reverseOrder={false} />
            {isLoading ? (<Loader />) : (<MovieGrid movies={movies} onSelect={handleSelect} />)}
            {error && (<ErrorMessage />) }
            {selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />)}
        </div>
    );
}