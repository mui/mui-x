import { ScrollToBottomAffordance } from './ScrollToBottomAffordance';
import { TypingIndicator } from './TypingIndicator';
import { UnreadMarker } from './UnreadMarker';

export { TypingIndicator } from './TypingIndicator';
export { UnreadMarker } from './UnreadMarker';
export { ScrollToBottomAffordance } from './ScrollToBottomAffordance';

export type {
  ScrollToBottomAffordanceProps,
  ScrollToBottomAffordanceSlotProps,
  ScrollToBottomAffordanceSlots,
} from './ScrollToBottomAffordance';
export type {
  TypingIndicatorProps,
  TypingIndicatorSlotProps,
  TypingIndicatorSlots,
} from './TypingIndicator';
export type {
  UnreadMarkerProps,
  UnreadMarkerSlotProps,
  UnreadMarkerSlots,
} from './UnreadMarker';
export type {
  ScrollToBottomAffordanceOwnerState,
  TypingIndicatorOwnerState,
  UnreadMarkerOwnerState,
} from './indicators.types';

export const Indicators = {
  TypingIndicator,
  UnreadMarker,
  ScrollToBottomAffordance,
} as const;
