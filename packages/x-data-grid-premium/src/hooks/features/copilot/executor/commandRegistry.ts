import type { CommandHandler, Guards } from './types';
import { selectionCommands } from './commands/selection';
import { historyCommands } from './commands/history';
import { stateCommands } from './commands/state';
import { viewCommands } from './commands/view';
import { columnsCommands } from './commands/columns';
import { rowsCommands } from './commands/rows';
import { editingCommands } from './commands/editing';
import { dataSourceCommands } from './commands/dataSource';
import { exportCommands } from './commands/export';

const ALL_COMMAND_HANDLERS: CommandHandler[] = [
  ...selectionCommands,
  ...historyCommands,
  ...stateCommands,
  ...viewCommands,
  ...columnsCommands,
  ...rowsCommands,
  ...editingCommands,
  ...dataSourceCommands,
  ...exportCommands,
];

export interface CommandRegistry {
  resolve(type: string): CommandHandler | undefined;
  all(): CommandHandler[];
}

export function buildCommandRegistry(guards: Guards): CommandRegistry {
  const visible = ALL_COMMAND_HANDLERS.filter((h) => h.tier !== 3 || guards.mutations);
  const byType = new Map<string, CommandHandler>();
  for (const handler of visible) {
    byType.set(handler.type, handler);
  }
  return {
    resolve(type: string) {
      return byType.get(type);
    },
    all() {
      return visible;
    },
  };
}

export { ALL_COMMAND_HANDLERS };
