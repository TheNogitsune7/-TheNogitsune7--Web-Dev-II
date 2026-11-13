# watch.it — Task 2

A movie catalogue built with React function components, CSS Grid, Flexbox, and media queries.

## Open the website

The downloaded project includes `OPEN-WEBSITE.html`. Double-click this file to preview the site directly in your browser, without installing anything. Google Fonts and trailer links use an internet connection.

## Edit and run the React project

Install Node.js LTS (Node 20.19+ or 22.12+), then open this folder in VS Code. In **Terminal → New Terminal**, run:

```sh
npm install
npm run dev
```

Open the Local URL printed in the terminal, normally `http://localhost:5173`. Keep the terminal running while viewing the site. The source `index.html` is the entry point for Vite; open it through the development server when editing the React source.

## Build

```sh
npm run build
npm run preview
```

The build creates `dist/`, including a standalone `OPEN-WEBSITE.html` preview with the code, styles and movie posters embedded.

## Layout

- Below 720px: one column; genre navigation is hidden.
- 720px–1023px: two columns with equally sized cards.
- 1024px and above: a wide featured card, two vertical cards, then three horizontal cards.

The content has a 900px maximum width. Small spacing is 16px. Large spacing is 16px on mobile, 32px on tablet, and 48px on desktop.

## Interactions

Search filters by title, year, genre, or description. Genre links filter the catalogue; select the active genre again or click the logo to reset. Watch Now opens the film's trailer on YouTube in a new tab.

## GitHub folder

Place this project's contents in `assessment-1-clone-tasks/task-2-responsive-layouts/`. Include `src/`, `scripts/`, `public/`, `package.json`, `package-lock.json`, `index.html`, and this README. The preview HTML is optional for the repository. `node_modules/` and `dist/` are generated locally.
