import React, { useEffect, useRef, useState } from 'react';
import content from './content.json';

const navigation = [
  { label: 'Our Blog', target: '#article' },
  { label: 'Our Artists', target: '#releases' },
  { label: 'Our Story', target: '#author' },
];

const socialLinks = [
  { name: 'Facebook', image: 'facebook-icon.png', url: 'https://www.facebook.com/erasedtapes' },
  { name: 'Twitter', image: 'twitter-icon.svg', url: 'https://twitter.com/erasedtapes' },
  { name: 'Instagram', image: 'instagram-icon.png', url: 'https://www.instagram.com/erasedtapesrecords/' },
];

const albums = [
  { file: 'all-encores.webp', title: 'All Encores', artist: 'Nils Frahm', description: 'Red and green geometric shapes on textured brown paper' },
  { file: 'articulation.webp', title: 'Articulation', artist: 'Rival Consoles', description: 'A transparent compact disc with a purple geometric shape and white dots' },
  { file: 'encores-2.webp', title: 'Encores 2', artist: 'Nils Frahm', description: 'Minimal typography on a textured deep teal background' },
  { file: 'eulogy-for-evolution.webp', title: 'Eulogy for Evolution 2017', artist: 'Ólafur Arnalds', description: 'A weathered stone building in a misty landscape' },
  { file: 'blurred.webp', title: 'Blurred EP', artist: 'Kiasmos', description: 'An iridescent pointed sculpture with black chevron lines' },
  { file: 'the-cell.webp', title: 'The Cell', artist: 'David Allred', description: 'An abstract red and white textured surface' },
];

function Navigation({ footer = false }) {
  return (
    <nav className="navigation" aria-label={footer ? 'Footer navigation' : 'Main navigation'}>
      {navigation.map(({ label, target }) => <a key={target} href={target}>{label}</a>)}
    </nav>
  );
}

function SocialLinks({ vertical = false }) {
  return (
    <ul className={`social-links${vertical ? ' social-links--vertical' : ''}`} aria-label="Follow Erased Tapes">
      {socialLinks.map(({ name, image, url }) => (
        <li key={name}>
          <a className={`social-link social-link--${name.toLowerCase()}`} href={url} target="_blank" rel="noopener noreferrer" aria-label={`Erased Tapes on ${name} (opens in a new tab)`}>
            <img src={`/assets/${image}`} width="50" height="50" alt="" loading="lazy" />
          </a>
        </li>
      ))}
    </ul>
  );
}

function Header() {
  return (
    <header className="site-header" id="top">
      <a className="brand" href="#top" aria-label="Erased Tapes home">
        <img src="/assets/logo.svg" width="200" height="200" alt="Erased Tapes" />
      </a>
      <Navigation />
    </header>
  );
}

function Article() {
  return (
    <div className="article-text" id="article">
      <h1><span className="title-name">Erased Tapes:</span><span className="title-subtitle">Exploring the Sonic Frontier</span></h1>
      <p className="introduction">{content.intro}</p>
      <div className="article-columns">
        {content.sections.map((section, index) => (
          <section className="article-section" key={index} aria-labelledby={`section-${index}`}>
            <h2 id={`section-${index}`}>{section.heading}</h2>
            {section.paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
      </div>
    </div>
  );
}

function ArtworkViewer({ selected, onClose }) {
  const [index, setIndex] = useState(selected);
  const dialog = useRef(null);
  const album = albums[index];

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

  function changeArtwork(direction) {
    setIndex((current) => (current + direction + albums.length) % albums.length);
  }

  function handleKeyDown(event) {
    if (event.key === 'ArrowLeft') changeArtwork(-1);
    if (event.key === 'ArrowRight') changeArtwork(1);
  }

  return (
    <dialog
      ref={dialog}
      className="artwork-viewer"
      aria-labelledby="artwork-title"
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onClick={(event) => { if (event.target === event.currentTarget) onClose(); }}
      onKeyDown={handleKeyDown}
    >
      <div className="artwork-viewer__panel">
        <button className="viewer-close" onClick={onClose} aria-label="Close artwork viewer">×</button>
        <img className="viewer-image" src={`/assets/${album.file}`} alt={album.description} width="900" height="900" />
        <div className="viewer-caption">
          <div><p id="artwork-title">{album.title}</p><p>{album.artist}</p></div>
          <div className="viewer-controls">
            <button onClick={() => changeArtwork(-1)} aria-label="Previous artwork">←</button>
            <span aria-live="polite">{index + 1} / {albums.length}</span>
            <button onClick={() => changeArtwork(1)} aria-label="Next artwork">→</button>
          </div>
        </div>
      </div>
    </dialog>
  );
}

function AlbumGallery() {
  const [selected, setSelected] = useState(null);
  return (
    <section className="album-section" id="releases" aria-label="Album artwork">
      <div className="album-grid">
        {albums.slice(0, 5).map((album, index) => (
          <button
            className={`album-tile${index === 0 ? ' album-tile--featured' : ''}`}
            key={album.file}
            onClick={() => setSelected(index)}
            aria-label={`View ${album.title} by ${album.artist}`}
          >
            <img src={`/assets/${album.file}`} alt={album.description} width="900" height="900" loading="lazy" />
            <span className="album-caption"><span>{album.title}<small>{album.artist}</small></span><span aria-hidden="true">↗</span></span>
          </button>
        ))}
      </div>
      {selected !== null && <ArtworkViewer selected={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function Author() {
  return (
    <section className="author" id="author" aria-labelledby="author-title">
      <div className="author-copy">
        <h2 id="author-title">The Author</h2>
        <p>{content.author}</p>
      </div>
      <img className="author-photo" src="/assets/profile_picture.webp" width="200" height="200" alt="Portrait of the article's author" loading="lazy" />
      <SocialLinks vertical />
    </section>
  );
}

function Comments() {
  return (
    <section className="comments" aria-labelledby="comments-title">
      <h2 id="comments-title">Comments</h2>
      <ol className="comment-list">
        {content.comments.map(({ name, text }) => (
          <li className="comment" key={name}>
            <p className="comment-name">{name}</p>
            <p>{text}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Navigation footer />
        <p>Copyright © 2023 Erased Disks Ltd.</p>
        <SocialLinks />
      </div>
    </footer>
  );
}

export default function App() {
  return (
    <>
      <a className="skip-link" href="#article">Skip to article</a>
      <Header />
      <main className="page-content">
        <article className="post" aria-label="Erased Tapes: Exploring the Sonic Frontier">
          <Article />
          <AlbumGallery />
          <Author />
        </article>
        <Comments />
      </main>
      <Footer />
    </>
  );
}
