import { onTestFinished } from 'vitest';
import type {} from './vitestBrowserCommands';

/** Makes `(pointer: coarse)` and `(hover: none)` match in CSS until the test finishes. */
export async function emulateTouch() {
  const { server } = await import('vitest/browser');
  await server.commands.setTouchEmulation(true);
  onTestFinished(() => server.commands.setTouchEmulation(false));
}
