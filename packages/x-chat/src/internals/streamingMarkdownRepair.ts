'use client';
import * as React from 'react';
import { normalizeMarkdownForRender } from '@mui/x-chat-headless/internals';

// Repairs incomplete markdown emitted mid-stream so partial syntax renders
// sensibly (e.g. an unterminated `**bold` or code fence) instead of leaking raw
// markers. Pure `string -> string`, renderer-agnostic.
export type RepairMarkdown = (text: string) => string;

/**
 * Dependency-free, CJS-safe baseline. Only the unambiguous completion the headless
 * layer already ships (closing an unbalanced code fence). Conservative on purpose —
 * it never guesses at inline markers, so it can't corrupt ordinary prose (`2 * 3`).
 * Used whenever the richer `remend` repair can't be loaded.
 */
export const fallbackRepair: RepairMarkdown = normalizeMarkdownForRender;

// `remend` is an ESM-only package and a declared dependency of this package. The
// build downlevels dynamic `import()` to `require()` in the CJS output, and a static
// `require()` of an ES module throws `ERR_REQUIRE_ESM`. Reading the specifier from a
// variable (plus the `@vite-ignore`/`webpackIgnore` hints) keeps that `require`/
// `import` dynamic and unanalyzable, so it stays a genuine runtime import that fails
// gracefully at call time instead of at build time. The `.catch` in `loadRemend`
// then degrades to `fallbackRepair` — so a runtime that can't resolve the specifier
// (or a CJS `require()` of the ESM module) costs nothing beyond the failed attempt.
const REMEND_SPECIFIER = 'remend';
function defaultRemendImporter(): Promise<unknown> {
  // eslint-disable-next-line jsdoc/no-bad-blocks -- bundler hint comments, not JSDoc
  return import(/* @vite-ignore */ /* webpackIgnore: true */ REMEND_SPECIFIER);
}

let remendPromise: Promise<RepairMarkdown> | undefined;

/**
 * Lazily loads `remend` and returns a repair function. If the import rejects — e.g.
 * the CJS build downlevelled it to a `require()` of the ESM-only module, or a
 * consumer's bundler can't resolve the runtime specifier — it transparently degrades
 * to {@link fallbackRepair}. Cached after the first call.
 *
 * @param importer Injectable for tests; defaults to `() => import('remend')`.
 */
export function loadRemend(
  importer: () => Promise<unknown> = defaultRemendImporter,
): Promise<RepairMarkdown> {
  if (!remendPromise) {
    remendPromise = importer()
      .then((mod) => {
        const remend = (mod as { default?: unknown })?.default ?? mod;
        if (typeof remend !== 'function') {
          return fallbackRepair;
        }
        const repair = remend as (text: string, options?: Record<string, unknown>) => string;
        // Only complete constructs the renderer actually understands; math is
        // opt-in, so completing `$…$` would just surface literal dollar signs.
        return (text: string) => repair(text, { katex: false });
      })
      .catch(() => fallbackRepair);
  }
  return remendPromise;
}

/** Resets the module-level cache. Test-only. */
export function resetRemendCache(): void {
  remendPromise = undefined;
}

/**
 * Returns the best available markdown-repair function. Renders with the dep-free
 * {@link fallbackRepair} immediately (also the SSR/first-paint value, so there is no
 * hydration mismatch), then upgrades to `remend` once it has loaded. Re-rendering
 * with the same `fallbackRepair` reference is a no-op (React bails on `Object.is`),
 * so a missing/blocked `remend` costs nothing beyond the one import attempt.
 */
export function useStreamingMarkdownRepair(): RepairMarkdown {
  const [repair, setRepair] = React.useState<RepairMarkdown>(() => fallbackRepair);

  React.useEffect(() => {
    // Skip the lazy `remend` upgrade under test. `remend` resolves from node_modules,
    // so the async `setRepair` below would land after a test's synchronous render and
    // trip React's "update not wrapped in act(...)" warning, which `vitest-fail-on-console`
    // turns into a failure across every component that renders markdown. The fallback
    // repair still runs, and `loadRemend`'s real wiring is covered directly in
    // `streamingMarkdownRepair.test.ts` via an injected importer.
    if (process.env.NODE_ENV === 'test') {
      return undefined;
    }
    let active = true;
    loadRemend().then((fn) => {
      // Only update when `remend` actually loaded (a different function). When it
      // can't load, `fn` IS `fallbackRepair` — skip the no-op state update.
      if (active && fn !== fallbackRepair) {
        // Functional update form so the function value isn't called as an updater.
        setRepair(() => fn);
      }
    });
    return () => {
      active = false;
    };
  }, []);

  return repair;
}
