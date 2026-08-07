import { readFileSync } from 'node:fs';
import { join } from 'node:path';

/** Read `version` from the package.json in `dir`, or undefined if it's missing/unreadable. */
export function readVersionFrom(dir: string): string | undefined {
  try {
    const pkg = JSON.parse(readFileSync(join(dir, 'package.json'), 'utf8')) as { version?: string };
    return pkg.version;
  } catch {
    return undefined;
  }
}

// The published package is flat (`build/` is the root), so package.json sits next to this file at
// runtime; in the source tree it's one level up. Try both, falling back to '0.0.0' so a bad layout
// can't crash `npx @mui/mcp` over server metadata.
export const SERVER_VERSION =
  readVersionFrom(__dirname) ?? readVersionFrom(join(__dirname, '..')) ?? '0.0.0';
