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
    ignores: [
      // ComponentApiBuilder in @mui/monorepo unconditionally annotates the
      // `slots` prop with `slotsApi: true`, which renders a
      // "[Slots API](#slots)" link in the props table. However, SlotsSection
      // bails out (returns null) when the component exposes no actual slot
      // entries, so the `#slots` anchor never lands on the page. Affects
      // ~17 charts/pickers pages on v8.x (e.g. bar-chart-premium, charts-x-axis,
      // date-field). Remove this ignore once the upstream builder stops
      // emitting the slotsApi annotation for components without slot data.
      { href: '#slots' },
    ],
    knownTargetsDownloadUrl: ['https://v7.mui.com/material-ui/link-structure.json'],
  });

  process.exit(issues.length);
}

main();
