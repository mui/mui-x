import { crawl } from '@mui/internal-code-infra/brokenLinksChecker';

async function main() {
  const { issues } = await crawl({
    startCommand: 'pnpm serve --no-request-logging -p 3001',
    host: 'http://localhost:3001/',
    seedUrls: ['/x'],
    // Target paths to ignore during link checking
    ignoredPaths: [
      // The site root has no page in the `next export` output (redirects only
      // apply in dev, not in the exported site), so the shared header's logo
      // link to `/` resolves to a 404 here even though mui.com redirects it.
      /^\/$/,
      // Internal links not on this server
      // TODO: Seed crawler with stored links from e.g. mui.com/x/link-structure.json
      // /^\/(base-ui|joy-ui|store|toolpad)(\/|$)/,
    ],
    knownTargetsDownloadUrl: ['https://mui.com/material-ui/link-structure.json'],
  });

  process.exit(issues.length);
}

main();
