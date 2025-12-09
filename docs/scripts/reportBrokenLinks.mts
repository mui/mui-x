import { crawl } from '@mui/internal-code-infra/brokenLinksChecker';

async function main() {
  const { issues } = await crawl({
    startCommand: 'pnpm serve --no-request-logging -p 3001',
    host: 'http://localhost:3001/',
    seedUrls: ['/x'],
    // Target paths to ignore during link checking
    ignoredPaths: [
      // Internal links not on this server
      // TODO: Seed crawler with stored links from e.g. mui.com/x/link-structure.json
      // /^\/(base-ui|joy-ui|store|toolpad)(\/|$)/,
    ],
    knownTargetsDownloadUrl: [
      // TODO: replace with https://mui.com/material-ui/link-structure.json when available
      'https://material-ui.netlify.app/material-ui/link-structure.json',
    ],
  });

  process.exit(issues.length);
}

main();
