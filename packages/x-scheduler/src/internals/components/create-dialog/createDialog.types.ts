import * as React from 'react';

export interface DialogState<TData> {
  isOpen: boolean;
  anchor: HTMLElement | null;
  data: TData | null;
}

export interface CreateDialogConfig {
  contextName: string;
}

export type ContextValue<TData> = {
  open: (anchor: HTMLElement, data: TData) => void;
  close: () => void;
  isOpen: boolean;
};

export interface ProviderProps<TData> {
  children: React.ReactNode;
  /**
   * Render function for the dialog.
   */
  render: (props: {
    isOpen: boolean;
    anchor: HTMLElement;
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
