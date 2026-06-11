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

export interface ModalImperativeHandle<TData> {
  /**
   * Imperatively open the modal with the given data and optional anchor element.
   */
  open: (data: TData, anchorRef?: React.RefObject<HTMLElement | null>) => void;
  /**
   * Imperatively close the modal.
   */
  close: () => void;
}

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
  onOpen?: (data: TData) => void;
  onClose?: () => void;
  /**
   * Ref that exposes imperative open/close methods.
   */
  imperativeRef?: React.Ref<ModalImperativeHandle<TData>>;
}

export interface TriggerProps<TData> {
  children: React.ReactNode;
  data: TData;
  onClick?: React.MouseEventHandler;
}
