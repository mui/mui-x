import type { CommandPack, PatchPack } from '@mui/x-copilot';
import { ALL_STUDIO_COMMAND_HANDLERS } from './commands';
import { ALL_STUDIO_PATCH_HANDLERS } from './reconcilers';
import type { StudioHostAdapter } from './studioHostAdapter';
import type { StudioStateDocument } from './stateDocument';

/**
 * The Studio's command pack. Aggregates every `CommandHandler` in
 * `commands/{view,dataSource}.ts` into the x-copilot pack shape.
 */
export const studioCommandPack: CommandPack<StudioHostAdapter, StudioStateDocument> = {
  id: 'data-studio',
  handlers: ALL_STUDIO_COMMAND_HANDLERS,
};

/**
 * The Studio's reconciler pack. Aggregates every `PatchHandler` in
 * `reconcilers/*.ts`.
 */
export const studioReconcilerPack: PatchPack<StudioHostAdapter, StudioStateDocument> = {
  id: 'data-studio',
  handlers: ALL_STUDIO_PATCH_HANDLERS,
};
