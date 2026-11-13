import { readFile, writeFile, readdir } from 'node:fs/promises';
import path from 'node:path';

const directory = path.resolve(process.argv[2] || 'dist');
let html = await readFile(path.join(directory, 'index.html'), 'utf8');
const types = { '.webp': 'image/webp', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.png': 'image/png', '.svg': 'image/svg+xml' };
const assets = new Map();

async function collect(folder) {
  for (const entry of await readdir(folder, { withFileTypes: true })) {
    const absolute = path.join(folder, entry.name);
    if (entry.isDirectory()) await collect(absolute);
    else if (types[path.extname(entry.name)]) {
      const relative = '/' + path.relative(directory, absolute).split(path.sep).join('/');
      const buffer = await readFile(absolute);
      assets.set(relative, `data:${types[path.extname(entry.name)]};base64,${buffer.toString('base64')}`);
    }
  }
}

await collect(directory);

function embedImages(source) {
  for (const [url, data] of assets) source = source.replaceAll(url, data);
  return source;
}

const cssTags = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/g)];
for (const [tag] of cssTags) {
  const url = tag.match(/href="([^"]+)"/)[1];
  const css = await readFile(path.join(directory, url.replace(/^\//, '')), 'utf8');
  html = html.replace(tag, () => `<style>${embedImages(css)}</style>`);
}

const scriptTags = [...html.matchAll(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/g)];
for (const [tag, url] of scriptTags) {
  let code = await readFile(path.join(directory, url.replace(/^\//, '')), 'utf8');
  let usesDynamicImages = false;
  code = code.replace(/`\/assets\/\$\{([^}]+)\}`/g, (_, expression) => {
    usesDynamicImages = true;
    return `__embeddedImageAssets[${expression}]`;
  });
  if (usesDynamicImages) {
    const imagesByFilename = Object.fromEntries([...assets].filter(([name]) => name.startsWith('/assets/')).map(([name, data]) => [name.slice('/assets/'.length), data]));
    code = `const __embeddedImageAssets=${JSON.stringify(imagesByFilename)};` + code;
  }
  html = html.replace(tag, () => `<script type="module">${embedImages(code).replaceAll('</script', '<\\/script')}</script>`);
}

html = embedImages(html).replace(/<link\b[^>]*rel="modulepreload"[^>]*>/g, '');
await writeFile(path.join(directory, 'OPEN-WEBSITE.html'), html);
console.log('Created OPEN-WEBSITE.html with embedded code, styles and images.');
