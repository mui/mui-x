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

export const historyRedo: CommandHandler<void> = {
  type: 'history.redo',
  namespace: 'history',
  tier: 2,
  plan: 'premium',
  guard: null,
  phase: 'history',
  dependsOn: (_, ctx) => Array.from(ctx.appliedSlices),
  run: (_, ctx) => {
    const history: any = (ctx.apiRef.current as any).history;
    if (history?.redo) {
      return history.redo();
    }
    return undefined;
  },
};

export const historyClear: CommandHandler<void> = {
  type: 'history.clear',
  namespace: 'history',
  tier: 3,
  plan: 'premium',
  guard: 'mutations',
  phase: 'history',
  run: (_, ctx) => {
    const history: any = (ctx.apiRef.current as any).history;
    if (history?.clear) {
      return history.clear();
    }
    return undefined;
  },
};

export const historyCommands: CommandHandler[] = [historyUndo, historyRedo, historyClear];
