import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.join(__dirname, '..', 'packages', 'x-charts', 'src');

function walk(dir) {
  const files = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) files.push(...walk(p));
    else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) files.push(p);
  }
  return files;
}

const files = walk(srcDir).filter(f => !f.includes('.test.') && !f.includes('__tests__') && !f.includes('.spec.'));
let fixCount = 0;
for (const f of files) {
  const content = fs.readFileSync(f, 'utf8');
  if (!content.includes('import type { type ') && !content.includes('import type {\n  type ')) continue;
  // Fix: 'import type { type X, type Y }' -> 'import type { X, Y }'
  const fixed = content.replace(/import type \{([^}]+)\}/g, (match, inner) => {
    if (!inner.includes('type ')) return match;
    const cleaned = inner.replace(/\btype\s+/g, '');
    return 'import type {' + cleaned + '}';
  });
  if (fixed !== content) {
    fs.writeFileSync(f, fixed, 'utf8');
    fixCount++;
    console.log('Fixed:', f.replace(path.join(__dirname, '..') + path.sep, '').replace(/\\/g, '/'));
  }
}
console.log(`Fixed ${fixCount} files`);
