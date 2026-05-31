import type { HostAdapter } from './hostAdapter';
import type { PatchHandler, PatchPack } from './handlers';
import type { Guards, SlicePath } from './types';

export interface PatchRegistry<TAdapter extends HostAdapter = HostAdapter, TState = unknown> {
  resolve(path: string): PatchHandler<TAdapter, TState> | undefined;
  all(): ReadonlyArray<PatchHandler<TAdapter, TState>>;
}

interface ResolvedHandler<TAdapter extends HostAdapter, TState> {
  handler: PatchHandler<TAdapter, TState>;
  packId: string;
}

function pathMatches(handlerPath: SlicePath, opPath: string): boolean {
  // Tokenize both, treating `<id>` placeholders as wildcards.
  const handlerTokens = handlerPath.split('/').slice(1);
  const opTokens = opPath.split('/').slice(1);
  if (handlerTokens.length > opTokens.length) {
    return false;
  }
  for (let i = 0; i < handlerTokens.length; i += 1) {
    const ht = handlerTokens[i];
    const ot = opTokens[i];
    if (ht.startsWith('<') && ht.endsWith('>')) {
      if (!ot) {
        return false;
      }
      continue;
    }
    if (ht !== ot) {
      return false;
    }
  }
  return true;
}

function applyPrefix(path: SlicePath, prefix: SlicePath | undefined): SlicePath {
  if (!prefix) {
    return path;
  }
  const normalizedPrefix = prefix.endsWith('/') ? prefix.slice(0, -1) : prefix;
  return `${normalizedPrefix}${path.startsWith('/') ? path : `/${path}`}`;
}

/**
 * Build a patch registry from one or more packs. Filters by guard/tier:
 *   - tier-3 handlers are hidden when `guards.mutations === false`
 *   - handlers with `guard` set are hidden when `guards[guard] === false`
 *
 * Supports `pathPrefix` for composing a sub-tree under a hybrid host's state.
 * Last-pack-wins on duplicate `path`; dev warning when not declared in `overrides`.
 */
export function buildPatchRegistry<TAdapter extends HostAdapter, TState = unknown>(
  guards: Guards,
  packs: ReadonlyArray<PatchPack<TAdapter, TState>>,
): PatchRegistry<TAdapter, TState> {
  const byPath = new Map<string, ResolvedHandler<TAdapter, TState>>();

  for (const pack of packs) {
    for (const rawHandler of pack.handlers) {
      if (rawHandler.tier === 3 && !guards.mutations) {
        continue;
      }
      if (rawHandler.guard && guards[rawHandler.guard] === false) {
        continue;
      }
      const handler: PatchHandler<TAdapter, TState> = pack.pathPrefix
        ? { ...rawHandler, path: applyPrefix(rawHandler.path, pack.pathPrefix) }
        : rawHandler;

      const existing = byPath.get(handler.path);
      if (existing && process.env.NODE_ENV !== 'production') {
        const overridesAllowed = pack.overrides?.includes(existing.packId);
        if (!overridesAllowed) {
           
          console.warn(
            `MUI X Copilot: pack "${pack.id}" overrode patch path "${handler.path}" from "${existing.packId}" ` +
              `without declaring \`overrides: ['${existing.packId}']\`.`,
          );
        }
      }
      byPath.set(handler.path, { handler, packId: pack.id });
    }
  }

  const visible = Array.from(byPath.values()).map((entry) => entry.handler);

  // Order by descending path specificity so `/pivot/active` wins over `/pivot`.
  const ordered = visible.slice().sort((a, b) => b.path.split('/').length - a.path.split('/').length);

  return {
    resolve(path: string) {
      for (const handler of ordered) {
        if (pathMatches(handler.path, path)) {
          return handler;
        }
      }
      return undefined;
    },
    all() {
      return visible;
    },
  };
}
