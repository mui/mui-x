import { ThreadActions } from './ThreadActions';
import { ThreadHeader } from './ThreadHeader';
import { ThreadRoot } from './ThreadRoot';
import { ThreadSubtitle } from './ThreadSubtitle';
import { ThreadTitle } from './ThreadTitle';

export { ThreadRoot } from './ThreadRoot';
export { ThreadHeader } from './ThreadHeader';
export { ThreadTitle } from './ThreadTitle';
export { ThreadSubtitle } from './ThreadSubtitle';
export { ThreadActions } from './ThreadActions';

export type {
  ThreadRootProps,
  ThreadRootSlotProps,
  ThreadRootSlots,
} from './ThreadRoot';
export type {
  ThreadHeaderProps,
  ThreadHeaderSlotProps,
  ThreadHeaderSlots,
} from './ThreadHeader';
export type {
  ThreadTitleProps,
  ThreadTitleSlotProps,
  ThreadTitleSlots,
} from './ThreadTitle';
export type {
  ThreadSubtitleProps,
  ThreadSubtitleSlotProps,
  ThreadSubtitleSlots,
} from './ThreadSubtitle';
export type {
  ThreadActionsProps,
  ThreadActionsSlotProps,
  ThreadActionsSlots,
} from './ThreadActions';
export type {
  ThreadActionsOwnerState,
  ThreadHeaderOwnerState,
  ThreadOwnerState,
  ThreadRootOwnerState,
  ThreadSubtitleOwnerState,
  ThreadTitleOwnerState,
} from './thread.types';

export const Thread = {
  Root: ThreadRoot,
  Header: ThreadHeader,
  Title: ThreadTitle,
  Subtitle: ThreadSubtitle,
  Actions: ThreadActions,
} as const;
