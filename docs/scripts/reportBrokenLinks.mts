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
    knownTargetsDownloadUrl: ['https://v7.mui.com/material-ui/link-structure.json'],
    // The `slots` prop description on API pages auto-renders a "See [Slots
    // API](#slots) below for more details." link. On v8.x, components whose
    // slots are inherited from a parent (and therefore not redeclared as a
    // typed `XxxSlots` interface) are not picked up by the API builder, so
    // those pages have no `#slots` section even though the prop description
    // points to one. Ignore the resulting in-page anchor on `/x/api/*`.
    ignores: [{ path: /^\/x\/api\//, href: '#slots' }],
  });

  process.exit(issues.length);
}

main();
