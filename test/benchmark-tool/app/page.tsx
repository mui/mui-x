import * as React from 'react';
import fs from 'fs';
import path from 'path';
import Link from 'next/link';

function getBenchmarks() {
  const appDir = path.join(process.cwd(), 'app');
  const entries = fs.readdirSync(appDir, { withFileTypes: true });

  return entries
    .filter((entry) => {
      if (!entry.isDirectory()) {
        return false;
      }

      // Check if directory has a page.tsx file
      const pagePath = path.join(appDir, entry.name, 'page.tsx');
      return fs.existsSync(pagePath);
    })
    .map((entry) => ({
      name: entry.name
        .split('-')
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' '),
      href: `/${entry.name}`,
    }));
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
