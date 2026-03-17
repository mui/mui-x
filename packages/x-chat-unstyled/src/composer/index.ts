import { ComposerAttachButton } from './ComposerAttachButton';
import { ComposerHelperText } from './ComposerHelperText';
import { ComposerInput } from './ComposerInput';
import { ComposerRoot } from './ComposerRoot';
import { ComposerSendButton } from './ComposerSendButton';
import { ComposerToolbar } from './ComposerToolbar';

export { ComposerRoot } from './ComposerRoot';
export { ComposerInput } from './ComposerInput';
export { ComposerSendButton } from './ComposerSendButton';
export { ComposerAttachButton } from './ComposerAttachButton';
export { ComposerToolbar } from './ComposerToolbar';
export { ComposerHelperText } from './ComposerHelperText';

export type { ComposerRootProps, ComposerRootSlotProps, ComposerRootSlots } from './ComposerRoot';
export type {
  ComposerInputProps,
  ComposerInputSlotProps,
  ComposerInputSlots,
} from './ComposerInput';
export type {
  ComposerSendButtonProps,
  ComposerSendButtonSlotProps,
  ComposerSendButtonSlots,
} from './ComposerSendButton';
export type {
  ComposerAttachButtonProps,
  ComposerAttachButtonSlotProps,
  ComposerAttachButtonSlots,
} from './ComposerAttachButton';
export type {
  ComposerToolbarProps,
  ComposerToolbarSlotProps,
  ComposerToolbarSlots,
} from './ComposerToolbar';
export type {
  ComposerHelperTextProps,
  ComposerHelperTextSlotProps,
  ComposerHelperTextSlots,
} from './ComposerHelperText';
export type {
  ComposerAttachButtonOwnerState,
  ComposerHelperTextOwnerState,
  ComposerInputOwnerState,
  ComposerOwnerState,
  ComposerRootOwnerState,
  ComposerSendButtonOwnerState,
  ComposerToolbarOwnerState,
} from './composer.types';

export const Composer = {
  Root: ComposerRoot,
  Input: ComposerInput,
  SendButton: ComposerSendButton,
  AttachButton: ComposerAttachButton,
  Toolbar: ComposerToolbar,
  HelperText: ComposerHelperText,
} as const;
