import type { HostAdapter } from './hostAdapter';
import type { CommandHandler, CommandPack } from './handlers';
import type { Guards } from './types';

export interface CommandRegistry<TAdapter extends HostAdapter = HostAdapter, TState = unknown> {
  resolve(type: string): CommandHandler<TAdapter, TState> | undefined;
  all(): ReadonlyArray<CommandHandler<TAdapter, TState>>;
}

interface ResolvedHandler<TAdapter extends HostAdapter, TState> {
  handler: CommandHandler<TAdapter, TState>;
  packId: string;
}

/**
 * Build a command registry from one or more packs. Filters by guard/tier:
 *   - tier-3 handlers are hidden when `guards.mutations === false`
 *   - handlers with `guard` set are hidden when `guards[guard] === false`
 *
 * Last-pack-wins on duplicate `type`. A dev-mode warning is emitted when the
 * later pack does not list the earlier pack's id in its `overrides`.
 */
export function buildCommandRegistry<TAdapter extends HostAdapter, TState = unknown>(
  guards: Guards,
  packs: ReadonlyArray<CommandPack<TAdapter, TState>>,
): CommandRegistry<TAdapter, TState> {
  const byType = new Map<string, ResolvedHandler<TAdapter, TState>>();

  for (const pack of packs) {
    for (const handler of pack.handlers) {
      // Tier-3 (mutation-class) handlers gated by guards.mutations
      if (handler.tier === 3 && !guards.mutations) {
        continue;
      }
      // Handler-level guard
      if (handler.guard && guards[handler.guard] === false) {
        continue;
      }
      const existing = byType.get(handler.type);
      if (existing && process.env.NODE_ENV !== 'production') {
        const overridesAllowed = pack.overrides?.includes(existing.packId);
        if (!overridesAllowed) {
           
          console.warn(
            `MUI X Copilot: pack "${pack.id}" overrode command "${handler.type}" from "${existing.packId}" ` +
              `without declaring \`overrides: ['${existing.packId}']\`.`,
          );
        }
      }
      byType.set(handler.type, { handler, packId: pack.id });
    }
  }

  const visible = Array.from(byType.values()).map((entry) => entry.handler);

  return {
    resolve(type: string) {
      return byType.get(type)?.handler;
    },
    all() {
      return visible;
    },
  };
}
