import type { CommandHandler } from '@mui/x-copilot';
import type { StudioHostAdapter } from '../studioHostAdapter';
import type { StudioStateDocument } from '../stateDocument';
import { studioViewCommands } from './view';
import { studioDatasetCommands } from './dataset';

export * from './view';
export * from './dataset';

export const ALL_STUDIO_COMMAND_HANDLERS: ReadonlyArray<
  CommandHandler<StudioHostAdapter, StudioStateDocument>
> = [...studioViewCommands, ...studioDatasetCommands];
