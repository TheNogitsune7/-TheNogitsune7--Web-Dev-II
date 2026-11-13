# Erased Tapes — Task 1

A responsive blog layout built with React function components and plain CSS.

## Run locally

Use Node.js 20.19+ or 22.12+.

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

The production files are created in `dist/`.

## Project structure

- `src/App.jsx`: header, navigation, article, album gallery, author, comments, and footer components.
- `src/content.json`: supplied article text and comments.
- `src/styles.css`: typography, colours, layout, and responsive breakpoints.
- `public/assets/`: logo, optimised album covers, portrait, and social icons.

The article flows through three columns on desktop, two on smaller screens, and one on mobile. The album gallery uses CSS Grid; navigation and the author section use Flexbox. Click an album to view its artwork. Use the arrow controls or arrow keys to browse all six covers, and Escape to close the viewer. Navigation links move to the relevant section of the page.

The project belongs in `assessment-1-clone-tasks/task-1-layout-in-react/`. This build covers Task 1.
