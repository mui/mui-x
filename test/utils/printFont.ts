import { onTestFinished } from 'vitest';
import type {} from './vitestBrowserCommands';

/** Holds a real font request until the test chooses success or failure. */
export async function setupPrintFont() {
  const { server } = await import('vitest/browser');
  const url = await server.commands.deferPrintFont();
  const resolve = (result: 'loaded' | 'error') => server.commands.resolvePrintFont(result);
  onTestFinished(() => server.commands.resolvePrintFont('cleanup'));

  return {
    css: `
      @font-face {
        font-family: PrintExportTest;
        src: url("${url}");
      }
      body, body * { font-family: PrintExportTest !important; }
    `,
    resolve,
  };
}
