/**
 * Registers the Playwright `page.on('crash')` handler for the current browser page.
 *
 * With `isolate: false` every test file in a project shares one page, but setup files are
 * re-evaluated per file, so this guard lives in a regular module: its instance is cached
 * for the lifetime of the page, while the setup file around it is not. Without it the
 * handler is attached once per test file and a single crash is reported dozens of times.
 */
let isRegistered = false;

export async function setupCrashHandlerOnce() {
  if (isRegistered) {
    return;
  }
  isRegistered = true;
  const { server } = await import('vitest/browser');
  await server.commands.setupCrashHandler();
}
