// VISUL BOOKS — static build using built-in Node modules (no npm packages).
import { readdir, readFile, rm, mkdir, cp, writeFile } from 'node:fs/promises';
import path from 'node:path';
const root = process.cwd();
const out = path.join(root, 'dist');
await rm(out, { recursive: true, force: true });
await mkdir(out, { recursive: true });
await cp(path.join(root, 'public'), out, { recursive: true });
const bookDir = path.join(root, 'content', 'books');
const bookFiles = (await readdir(bookDir)).filter(name => name.endsWith('.json')).sort();
const books = [];
for (const filename of bookFiles) {
  const book = JSON.parse(await readFile(path.join(bookDir, filename), 'utf8'));
  if (book.published === false) continue;
  books.push({ id: filename.replace(/\.json$/, ''), ...book });
}
const settings = JSON.parse(await readFile(path.join(root, 'content', 'settings.json'), 'utf8'));
await writeFile(path.join(out, 'catalogue.json'), JSON.stringify({ settings, books }, null, 2));
console.log(`Website ready: ${books.length} published books in dist/`);
