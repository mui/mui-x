import * as React from 'react';

export interface ModalState<TData> {
  data: TData | null;
  isOpen?: boolean;
}

export interface CreateModalConfig {
  contextName: string;
}

export type ContextValue<TData> = {
  onOpen: (anchorRef: React.RefObject<HTMLElement | null>, data: TData) => void;
  onClose: () => void;
  isOpen: boolean;
  /**
   * The data associated with the currently open modal, or null if the modal is closed.
   */
  data: TData | null;
  /**
   * A component can subscribe to a modal close event and react to it
   * e.g. Closing the `MoreEventsPopover` when an `EventDialog` closes
   */
  subscribeCloseHandler: (handler: () => void) => () => void;
};

export interface ProviderProps<TData> {
  children: React.ReactNode;
  /**
   * Render function for the modal.
   */
  render: (props: {
    isOpen: boolean;
    anchorRef: React.RefObject<HTMLElement | null>;
    data: TData;
    onClose: () => void;
  }) => React.ReactNode;
  /**
   * Whether the modal is positioned relative to an anchor element (e.g. a dialog/popover opened
   * next to the clicked event). When `true`, the modal only renders once an anchor is available.
   * Set to `false` for surfaces that don't need an anchor (e.g. an in-flow drawer or a centered
   * bottom-sheet), so they still stack through this backbone via `subscribeCloseHandler`.
   * @default true
   */
  anchored?: boolean;
  onOpen?: (data: TData) => void;
  onClose?: () => void;
}

export interface TriggerProps<TData> {
  children: React.ReactNode;
  data: TData;
  onClick?: React.MouseEventHandler;
}
