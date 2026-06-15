import { crawl } from '@mui/internal-code-infra/brokenLinksChecker';

async function main() {
  const { issues } = await crawl({
    startCommand: 'pnpm serve --no-request-logging -p 3001',
    host: 'http://localhost:3001/',
    seedUrls: ['/x'],
    // Target paths to ignore during link checking
    ignoredPaths: [
      // Next.js build output (hashed JS/CSS chunks and their `.js.map` source
      // maps). The crawler spawns a worker thread, fetches and HTML-validates
      // every URL it discovers, so crawling these assets means downloading and
      // parsing thousands of (often multi-MB) build files — which blew past
      // Netlify's 18-minute build timeout. They are emitted by the build and not
      // navigable pages, so there is nothing to link-check here.
      /\/_next\//,
      // Links to other MUI products and main-site pages (blog, pricing, etc.)
      // that are not served by this `/x`-only docs export. They resolve on the
      // live mui.com site but 404 in this isolated preview build.
      // TODO: Validate these against stored links once link-structure.json is
      // published for each product (e.g. mui.com/material-ui/link-structure.json).
      /^\/(material-ui|base-ui|joy-ui|system|store|toolpad|blog|pricing|about|careers)(\/|$)/,
    ],
  });

  process.exit(issues.length);
}

main();
