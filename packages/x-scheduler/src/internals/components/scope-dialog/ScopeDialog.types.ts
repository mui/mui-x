import { RecurringEventUpdateScope } from '@mui/x-scheduler-headless/models';
import * as React from 'react';

export interface ScopePopoverProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * The container element for the portal.
   */
  container: HTMLElement | null;
  /**
   * Resolves the promise returned by `promptScope` with the selected scope or `null` if cancelled.
   */
  onResolve: (value: RecurringEventUpdateScope | null) => void;
}

export interface ScopeDialogContextValue {
  promptScope: () => Promise<RecurringEventUpdateScope | null>;
  isOpen: boolean;
}

export interface RecurringScopeDialogProviderProps {
  containerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}
