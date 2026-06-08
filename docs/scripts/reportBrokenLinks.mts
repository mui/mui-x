import { crawl } from '@mui/internal-code-infra/brokenLinksChecker';

async function main() {
  const { issues } = await crawl({
    startCommand: 'pnpm serve --no-request-logging -p 3001',
    host: 'http://localhost:3001/',
    seedUrls: ['/x'],
    // Target paths to ignore during link checking
    ignoredPaths: [
      // Links to other MUI products that are not served by this server.
      // TODO: Validate these against stored links once link-structure.json is
      // published for each product (e.g. mui.com/material-ui/link-structure.json).
      /^\/(material-ui|base-ui|joy-ui|system|store|toolpad)(\/|$)/,
    ],
  });

  process.exit(issues.length);
}

main();
