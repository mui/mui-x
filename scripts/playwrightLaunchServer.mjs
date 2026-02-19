import { chromium } from '@playwright/test';

/**
 * Starts a Playwright server that can be used for testing.
 * This is useful for circleCI environments where spawning multiple browsers consumes more of the limited resources.
 *
 * The server will listen on the specified port and WebSocket path.
 * The port can be set via the PORT environment variable, defaulting to 9050.
 * The WebSocket path can be set via the WS_PATH environment variable, defaulting to 'mui-browser'.
 */
(async () => {
  const browserServer = await chromium.launchServer({
    port: process.env.PORT ? Number.parseInt(process.env.PORT, 10) : 9050,
    wsPath: process.env.WS_PATH || 'mui-browser',
    // Some grid layout tests require scrollbars to be visible
    ignoreDefaultArgs: ['--hide-scrollbars'],
  });
  browserServer.process().stderr.pipe(process.stderr);
  // eslint-disable-next-line no-console
  console.log(browserServer.wsEndpoint());
})();
