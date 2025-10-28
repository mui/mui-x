import * as path from 'path';
import { crawl } from '@mui/internal-code-infra/brokenLinksChecker';

async function main() {
  const { issues } = await crawl({
    startCommand: 'pnpm serve --no-request-logging -p 3001',
    host: 'http://localhost:3001/',
    seedUrls: ['/x'],
    outPath: path.resolve(import.meta.url, '../export/x/link-structure.json'),
    // Target paths to ignore during link checking
    ignoredPaths: [
      // Internal links not on this server
      // TODO: Seed crawler with stored links from e.g. mui.com/x/link-structure.json
      // /^\/(base-ui|joy-ui|store|toolpad)(\/|$)/,
    ],
    knownTargetsDownloadUrl: [
      'https://deploy-preview-47113--material-ui.netlify.app/material-ui/link-structure.json',
    ],
  });

  process.exit(issues.length);
}

main();
