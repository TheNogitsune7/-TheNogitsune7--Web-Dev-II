import React, { useEffect, useRef, useState } from 'react';
import { movies } from './movies.js';

const genres = ['Action', 'Comedy', 'Romance', 'Drama'];

function Header({ genre, onGenreChange, onReset, onSearch }) {
  return (
    <header className="site-header">
      <h1 className="brand"><a href="#movies" onClick={onReset} aria-label="watch.it — show all films">watch.it</a></h1>
      <nav className="genre-navigation" aria-label="Movie genres">
        {genres.map((name) => (
          <a key={name} href={`?genre=${name}`} onClick={(event) => { event.preventDefault(); onGenreChange(genre === name ? '' : name); }} aria-current={genre === name ? 'page' : undefined}>{name}</a>
        ))}
      </nav>
      <button className="button search-button" onClick={onSearch}>SEARCH</button>
    </header>
  );
}

function SearchDialog({ initialQuery, onSearch, onClose }) {
  const dialog = useRef(null);
  const [query, setQuery] = useState(initialQuery);

  useEffect(() => {
    const node = dialog.current;
    const previousFocus = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    node.showModal();
    document.body.style.overflow = 'hidden';
    return () => {
      node.close();
      document.body.style.overflow = previousOverflow;
      previousFocus?.focus();
    };
  }, []);

  function submit(event) {
    event.preventDefault();
    onSearch(query.trim());
    onClose();
  }

  return (
    <dialog
      ref={dialog}
      className="search-dialog"
      aria-labelledby="search-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="search-panel">
        <button className="dialog-close" onClick={onClose} aria-label="Close search">×</button>
        <h2 id="search-title">Find your next film.</h2>
        <form onSubmit={submit} role="search">
          <label htmlFor="movie-query">Search by title, year or genre</label>
          <input id="movie-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Try Barbie or 2016" autoFocus />
          <button className="button" type="submit">SEARCH FILMS</button>
        </form>
      </div>
    </dialog>
  );
}

function MovieCard({ movie, index, useEditorialLayout }) {
  const layout = useEditorialLayout ? (index === 0 ? ' movie-card--featured' : index >= 3 ? ' movie-card--wide' : '') : '';
  return (
    <article className={`movie-card${layout}`} aria-labelledby={`${movie.id}-title`}>
      <div className="movie-poster">
        <img src={movie.poster} alt={`${movie.title} (${movie.year}) movie poster`} width="1200" height="1200" loading={index === 0 ? 'eager' : 'lazy'} />
      </div>
      <div className="movie-body">
        <h2 className="visually-hidden" id={`${movie.id}-title`}>{movie.title} ({movie.year})</h2>
        <p>{movie.description}</p>
        <a className="button watch-button" href={movie.trailer} target="_blank" rel="noopener noreferrer" title={`Watch the trailer for ${movie.title}`} aria-label={`Watch the trailer for ${movie.title} (opens in a new tab)`}>
          <span>WATCH</span>{' '}<span>NOW</span>
        </a>
      </div>
    </article>
  );
}

export default function App() {
  const [genre, setGenre] = useState(() => {
    const requested = typeof window === 'undefined' ? '' : new URLSearchParams(window.location.search).get('genre');
    return genres.includes(requested) ? requested : '';
  });
  const [query, setQuery] = useState('');
  const [searchOpen, setSearchOpen] = useState(false);
  const filtered = Boolean(genre || query);
  const visibleMovies = movies.filter((movie) => {
    const matchesGenre = !genre || movie.genres.includes(genre);
    const text = [movie.title, movie.year, ...movie.genres, movie.description].join(' ').toLowerCase();
    return matchesGenre && text.includes(query.toLowerCase());
  });

  function reset() {
    setGenre('');
    setQuery('');
  }

  return (
    <>
      <a className="skip-link" href="#movies">Skip to films</a>
      <Header genre={genre} onGenreChange={setGenre} onReset={reset} onSearch={() => setSearchOpen(true)} />
      <main className="catalogue" id="movies" aria-label="Movie catalogue">
        {filtered && (
          <div className="search-summary">
            <p role="status">{visibleMovies.length} {visibleMovies.length === 1 ? 'film' : 'films'}{genre ? ` in ${genre}` : ''}{query ? ` matching “${query}”` : ''}</p>
            <button onClick={reset}>Show all films <span aria-hidden="true">↗</span></button>
          </div>
        )}
        <div className="movie-grid">
          {visibleMovies.map((movie, index) => <MovieCard key={movie.id} movie={movie} index={index} useEditorialLayout={!filtered} />)}
        </div>
        {visibleMovies.length === 0 && (
          <div className="empty-state">
            <h2>No films found.</h2>
            <p>Try a different title, year or genre.</p>
            <button className="button" onClick={reset}>SHOW ALL FILMS</button>
          </div>
        )}
      </main>
      {searchOpen && <SearchDialog initialQuery={query} onSearch={setQuery} onClose={() => setSearchOpen(false)} />}
    </>
  );
}
