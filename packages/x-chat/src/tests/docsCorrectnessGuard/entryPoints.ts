import { fileURLToPath } from 'node:url';
import path from 'node:path';

/**
 * Absolute path of this file, robust to how the test runner exposes
 * `import.meta.url` (vitest may hand us a non-`file:` URL). Falls back to
 * stripping the URL scheme/query when `fileURLToPath` cannot be used.
 */
function thisFilePath(): string {
  const url = import.meta.url;
  try {
    return fileURLToPath(url);
  } catch {
    // Strip a leading scheme (e.g. `file://`) and any query/hash suffix.
    return url.replace(/^[a-z]+:\/\//i, '/').replace(/[?#].*$/, '');
  }
}

/**
 * Workspace root, resolved relative to this file (no cwd dependence).
 * This file lives at `packages/x-chat/src/tests/docsCorrectnessGuard/`, so the
 * workspace root is five directories up.
 */
export const workspaceRoot = path.resolve(path.dirname(thisFilePath()), '../../../../..');

/**
 * The set of `@mui/x-chat*` entry points docs are allowed to import from, mapped
 * to the source file that backs each one.
 *
 * This is a deliberate *docs allowlist*, intentionally narrower than
 * `packages/x-chat/package.json#exports`: `@mui/x-chat/core` and
 * `@mui/x-chat/types` (and `@mui/x-chat-headless/*` subpaths) are real entry
 * points via the `./*` exports maps, but docs are kept on these five sanctioned
 * specifiers. A specifier outside this map is reported as "not allowed in docs",
 * never "unknown entry point".
 */
export const ENTRY_POINTS: Record<string, string> = {
  '@mui/x-chat': path.join(workspaceRoot, 'packages/x-chat/src/index.ts'),
  '@mui/x-chat/headless': path.join(workspaceRoot, 'packages/x-chat/src/headless/index.ts'),
  '@mui/x-chat/locales': path.join(workspaceRoot, 'packages/x-chat/src/locales/index.ts'),
  '@mui/x-chat/themeAugmentation': path.join(
    workspaceRoot,
    'packages/x-chat/src/themeAugmentation/index.ts',
  ),
  '@mui/x-chat-headless': path.join(workspaceRoot, 'packages/x-chat-headless/src/index.ts'),
};

/** The allowed entry-point specifiers, in declaration order. */
export const ALLOWED_SPECIFIERS = Object.keys(ENTRY_POINTS);

/** Matches any `@mui/x-chat...` module specifier (allowed or not). */
export const CHAT_SPECIFIER_RE = /^@mui\/x-chat(\/[\w./-]+|-headless(\/[\w./-]+)?)?$/;

/** The directory that holds the chat documentation pages and demos. */
export const CHAT_DOCS_DIR = path.join(workspaceRoot, 'docs/data/chat');
