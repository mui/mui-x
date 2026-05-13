import { RecurrenceTab } from './components/event-dialog/RecurrenceTab';
import { RecurringScopeDialog } from './components/scope-dialog/ScopeDialog';

/** Slots that the premium scheduler injects into the community `EventDialogProvider`. */
export const PREMIUM_EVENT_DIALOG_SLOTS = {
  recurrenceTab: RecurrenceTab,
  recurringScopeDialog: RecurringScopeDialog,
};
