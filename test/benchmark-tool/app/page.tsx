import * as React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function getBenchmarks(dir: string = '', results: { name: string; href: string }[] = []) {
  const appDir = path.join(process.cwd(), 'app');
  const currentDir = path.join(appDir, dir);
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory()) {
      continue;
    }

    const relativePath = dir ? `${dir}/${entry.name}` : entry.name;
    const pagePath = path.join(currentDir, entry.name, 'page.tsx');

    // Check if directory has a page.tsx file
    if (fs.existsSync(pagePath)) {
      results.push({
        name: relativePath
          .split(/[-/]/)
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' '),
        href: `/${relativePath}`,
      });
    }

    // Recurse into subdirectory
    getBenchmarks(relativePath, results);
  }

  return results;
}

export default function Home() {
  const benchmarks = getBenchmarks();

  return (
    <main style={{ padding: '2rem' }}>
      <h1>MUI X Benchmark Tool</h1>
      <p>Select a benchmark to run:</p>
      <ul>
        {benchmarks.map((benchmark) => (
          <li key={benchmark.href}>
            <Link href={benchmark.href}>{benchmark.name}</Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
