import { crawl } from '@mui/internal-code-infra/brokenLinksChecker';

async function main() {
  const { issues } = await crawl({
    startCommand: 'pnpm serve --no-request-logging',
    host: 'http://localhost:3010/',
    seedUrls: ['/x/introduction/'],
    // Target paths to ignore during link checking
    ignoredPaths: [
      // The site root has no page in the `next export` output (redirects only
      // apply in dev, not in the exported site), so the shared header's logo
      // link to `/` resolves to a 404 here even though mui.com redirects it.
      /^\/$/,
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
