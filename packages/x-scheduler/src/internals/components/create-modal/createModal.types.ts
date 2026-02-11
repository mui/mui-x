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
  onClose?: () => void;
}

export interface TriggerProps<TData> {
  children: React.ReactNode;
  data: TData;
  onClick?: React.MouseEventHandler;
}
