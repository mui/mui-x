import { crawl } from '@mui/internal-code-infra/brokenLinksChecker';

async function main() {
  const { issues } = await crawl({
    startCommand: 'pnpm serve --no-request-logging -p 3001',
    host: 'http://localhost:3001/',
    seedUrls: ['/x'],
    // Target paths to ignore during link checking
    ignoredPaths: [
      // Links to other MUI products and main-site pages (blog, pricing, etc.)
      // that are not served by this `/x`-only docs export. They resolve on the
      // live mui.com site but 404 in this isolated preview build.
      // TODO: Validate these against stored links once link-structure.json is
      // published for each product (e.g. mui.com/material-ui/link-structure.json).
      /^\/(material-ui|base-ui|joy-ui|system|store|toolpad|blog|pricing|about|careers)(\/|$)/,
      // Build artifacts and static assets. `serve` renders an auto-generated
      // directory listing (full of `<a href>` links) for any directory without
      // an index.html. Following a link to such a directory (e.g. the export
      // root) lets the crawler walk the entire build tree, fetching every
      // `_next/static` chunk and static file one by one. That balloons the
      // crawl to thousands of pages and times out the Netlify build. These
      // assets are not navigable links worth checking, so skip them entirely.
      /^\/_next(\/|$)/,
      /^\/static(\/|$)/,
    ],
  });

  process.exit(issues.length);
}

main();
