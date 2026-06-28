import type { CommandHandler } from '../types';

export const historyUndo: CommandHandler<void> = {
  type: 'history.undo',
  namespace: 'history',
  tier: 2,
  plan: 'premium',
  guard: null,
  phase: 'history',
  dependsOn: (_, ctx) => Array.from(ctx.appliedSlices),
  run: (_, ctx) => {
    const history: any = (ctx.apiRef.current as any).history;
    if (history?.undo) {
      return history.undo();
    }
    return undefined;
  },
};

export const historyCommands: CommandHandler[] = [historyUndo];
