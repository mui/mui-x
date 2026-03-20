import { ConversationInputAttachButton } from './ConversationInputAttachButton';
import { ConversationInputHelperText } from './ConversationInputHelperText';
import { ConversationInputLabel } from './ConversationInputLabel';
import { ConversationInputTextArea } from './ConversationInputTextArea';
import { ConversationInputRoot } from './ConversationInputRoot';
import { ConversationInputSendButton } from './ConversationInputSendButton';
import { ConversationInputToolbar } from './ConversationInputToolbar';

export { ConversationInputRoot } from './ConversationInputRoot';
export { ConversationInputTextArea } from './ConversationInputTextArea';
export { ConversationInputSendButton } from './ConversationInputSendButton';
export { ConversationInputAttachButton } from './ConversationInputAttachButton';
export { ConversationInputToolbar } from './ConversationInputToolbar';
export { ConversationInputHelperText } from './ConversationInputHelperText';
export { ConversationInputLabel } from './ConversationInputLabel';

export type {
  ConversationInputRootProps,
  ConversationInputRootSlotProps,
  ConversationInputRootSlots,
} from './ConversationInputRoot';
export type {
  ConversationInputTextAreaProps,
  ConversationInputTextAreaSlotProps,
  ConversationInputTextAreaSlots,
} from './ConversationInputTextArea';
export type {
  ConversationInputSendButtonProps,
  ConversationInputSendButtonSlotProps,
  ConversationInputSendButtonSlots,
} from './ConversationInputSendButton';
export type {
  ConversationInputAttachButtonProps,
  ConversationInputAttachButtonSlotProps,
  ConversationInputAttachButtonSlots,
} from './ConversationInputAttachButton';
export type {
  ConversationInputToolbarProps,
  ConversationInputToolbarSlotProps,
  ConversationInputToolbarSlots,
} from './ConversationInputToolbar';
export type {
  ConversationInputHelperTextProps,
  ConversationInputHelperTextSlotProps,
  ConversationInputHelperTextSlots,
} from './ConversationInputHelperText';
export type {
  ConversationInputLabelProps,
  ConversationInputLabelSlotProps,
  ConversationInputLabelSlots,
} from './ConversationInputLabel';
export type {
  ConversationInputAttachButtonOwnerState,
  ConversationInputHelperTextOwnerState,
  ConversationInputTextAreaOwnerState,
  ConversationInputOwnerState,
  ConversationInputRootOwnerState,
  ConversationInputSendButtonOwnerState,
  ConversationInputToolbarOwnerState,
} from './conversation-input.types';

export const ConversationInput = {
  Root: ConversationInputRoot,
  Label: ConversationInputLabel,
  TextArea: ConversationInputTextArea,
  SendButton: ConversationInputSendButton,
  AttachButton: ConversationInputAttachButton,
  Toolbar: ConversationInputToolbar,
  HelperText: ConversationInputHelperText,
} as const;
