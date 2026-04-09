/**
 * Demo extraction from markdown files.
 */
import * as path from 'path';
import * as fs from 'node:fs';
import { CWD } from './config';
import type { DemoMap } from './types';

export function loadDemos(): DemoMap {
  const demos: DemoMap = new Map();

  const sections: { dir: string; prefix: string; urlPrefix: string }[] = [
    { dir: 'docs/data/charts', prefix: '/charts', urlPrefix: '/x/react-charts' },
    { dir: 'docs/data/chat', prefix: '/chat', urlPrefix: '/x/react-chat' },
    { dir: 'docs/data/date-pickers', prefix: '/date-pickers', urlPrefix: '/x/react-date-pickers' },
    { dir: 'docs/data/tree-view', prefix: '/tree-view', urlPrefix: '/x/react-tree-view' },
    { dir: 'docs/data/data-grid', prefix: '/data-grid', urlPrefix: '/x/react-data-grid' },
  ];

  for (const { dir, prefix, urlPrefix } of sections) {
    const mdFiles = findMarkdownFiles(path.resolve(CWD, dir));
    for (const mdFile of mdFiles) {
      const content = fs.readFileSync(mdFile, 'utf8');
      const headers = parseMarkdownHeaders(content);
      if (!headers.components) {
        continue;
      }

      const relativePath = path.relative(path.resolve(CWD, dir), mdFile);
      // Compute pathname: remove /data segment, get directory path
      const pathParts = relativePath.replace(/\\/g, '/').split('/');
      // Remove the filename - use directory path
      pathParts.pop();
      let pathname = `/${prefix.replace(/^\//, '')}/${pathParts.join('/')}`;
      // Clean up double slashes
      pathname = pathname.replace(/\/+/g, '/');

      const title = extractTitle(content);

      for (const comp of headers.components) {
        const existing = demos.get(comp) || [];

        // Handle data-grid components differently
        let demoPathname: string;
        if (prefix === '/data-grid' && mdFile.includes('/components/')) {
          demoPathname = `/x/react-data-grid/components/${pathParts[pathParts.length - 1]}`;
        } else {
          demoPathname = `${pathname.replace(prefix, urlPrefix)}/`;
        }

        existing.push({ demoPageTitle: title, demoPathname });
        demos.set(comp, existing);
      }
    }
  }

  return demos;
}

export function findMarkdownFiles(dir: string): string[] {
  if (!fs.existsSync(dir)) {
    return [];
  }
  const results: string[] = [];
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      results.push(...findMarkdownFiles(fullPath));
    } else if (entry.name.endsWith('.md') && !/-[a-z]{2}\.md$/.test(entry.name)) {
      results.push(fullPath);
    }
  }
  return results;
}

export function parseMarkdownHeaders(content: string): { components?: string[] } {
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) {
    return {};
  }
  const yaml = match[1];
  const compMatch = yaml.match(/^components:\s*(.+)$/m);
  if (!compMatch) {
    return {};
  }
  const components = compMatch[1]
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return { components };
}

export function extractTitle(content: string): string {
  const match = content.match(/^#\s+(.+)$/m);
  let title = match ? match[1].trim() : '';
  if (!title) {
    const yamlMatch = content.match(/^---\r?\n[\s\S]*?^title:\s*(.+)$/m);
    title = yamlMatch ? yamlMatch[1].trim() : '';
  }
  // Convert markdown links to HTML: [text](url 'title') → <a href="url" title="title">text</a>
  title = title.replace(
    /\[([^\]]*)\]\(([^)\s]+)(?:\s+'([^']*)')?\)/g,
    (_match, text, url, linkTitle) => {
      const titleAttr = linkTitle ? ` title="${linkTitle}"` : '';
      return `<a href="${url}"${titleAttr}>${text}</a>`;
    },
  );
  return title;
}
