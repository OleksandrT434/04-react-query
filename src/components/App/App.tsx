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
import { useEffect } from 'react';



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
    const { data, isLoading, isError, isSuccess} = useQuery({
        queryKey: ['movies', query, page],
        queryFn: () => fetchMovies({ query, page }),
        enabled: query !== "",
        placeholderData: keepPreviousData,
        
    });
    const movies = data?.results ?? [];
    const totalPages = data?.total_pages ?? 0;
    
    useEffect(() => {
        if (query && !isLoading && data?.results.length === 0) {
            toast.error('No movies found for your search query');
        }
    }, [query, data, isLoading]);
    
    return (
        <div className={css.app}>
            <Toaster position="top-center" reverseOrder={false} />
            <SearchBar onSubmit={handleSearch} />
            {isSuccess && totalPages > 1 && (
            <ReactPaginate
                    pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => {
                        const newPage = selected + 1;
                        if (newPage !== page) {
                            setPage(newPage);
                        }
                    }}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
                    renderOnZeroPageCount={null}
            />)}
            
            {query && isLoading ? (<Loader />) : (<MovieGrid movies={movies} onSelect={handleSelect} />)}
            {isError && (<ErrorMessage />) }
            {selectedMovie && (
            <MovieModal movie={selectedMovie} onClose={() => setSelectedMovie(null)} />)}
        </div>
    );
}