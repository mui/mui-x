import { Popover } from '@base-ui/react';

export interface PopoverState<TAnchorData> {
  isOpen: boolean;
  anchor: HTMLElement | null;
  data: TAnchorData | null;
}

export interface CreatePopoverConfig {
  contextName: string;
}

export type ContextValue<TAnchorData> = {
  open: (anchor: HTMLElement, data: TAnchorData) => void;
  close: () => void;
  isOpen: boolean;
};

export interface ProviderProps<TAnchorData> {
  children: React.ReactNode;
  containerRef: React.RefObject<HTMLElement | null>;
  modal?: boolean;
  renderPopover: (props: {
    anchor: HTMLElement;
    data: TAnchorData;
    container: HTMLElement | null;
    onClose: () => void;
  }) => React.ReactNode;
  onClose?: () => void;
  shouldBlockClose?: boolean;
}

export interface TriggerProps<TAnchorData> extends React.ComponentProps<typeof Popover.Trigger> {
  data: TAnchorData;
  nativeButton?: boolean;
}
