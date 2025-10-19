'use client';
import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import {
  ContextValue,
  CreatePopoverConfig,
  PopoverState,
  ProviderProps,
  TriggerProps,
} from './createPopover.types';

/**
 * Creates a reusable popover system with Provider, Trigger, and context management.
 * Handles popover opening, closing and anchoring behaviors.
 * Allows passing custom data to the popover when opened.
 *
 * @template TAnchorData - The type of data passed to the popover when opened
 * @param {CreatePopoverConfig} config - Configuration for the popover (requires `contextName`)
 * @returns An object containing `Context`, `useContext`, `Provider`, and `Trigger`
 */
export function createPopover<TAnchorData>(config: CreatePopoverConfig) {
  const Context = React.createContext<ContextValue<TAnchorData> | undefined>(undefined);

  function usePopoverContext(): ContextValue<TAnchorData> {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error(
        `Scheduler: \`${config.contextName}\` is missing. Hook must be placed within its Provider.`,
      );
    }
    return context;
  }

  function Provider(props: ProviderProps<TAnchorData>) {
    const { containerRef, children, renderPopover, onClose: onCloseProp, modal = true } = props;
    const [state, setState] = React.useState<PopoverState<TAnchorData>>({
      isOpen: false,
      anchor: null,
      data: null,
    });

    const open = useEventCallback((anchor: HTMLElement, data: TAnchorData) => {
      setState({ isOpen: true, anchor, data });
    });

    const close = useEventCallback(() => {
      if (!state.isOpen) {
        return;
      }
      onCloseProp?.();
      setState({ isOpen: false, anchor: null, data: null });
    });

    const contextValue = React.useMemo<ContextValue<TAnchorData>>(
      () => ({
        open,
        close,
        isOpen: state.isOpen,
      }),
      [open, close, state.isOpen],
    );

    return (
      <Context.Provider value={contextValue}>
        <Popover.Root open={state.isOpen} onOpenChange={close} modal={modal}>
          {children}
          {state.anchor &&
            state.data &&
            renderPopover({
              anchor: state.anchor,
              data: state.data,
              container: containerRef.current,
              onClose: close,
            })}
        </Popover.Root>
      </Context.Provider>
    );
  }

  function Trigger(props: TriggerProps<TAnchorData>) {
    const { data, nativeButton = false, onClick, ...other } = props;
    const { open } = usePopoverContext();

    return (
      <Popover.Trigger
        nativeButton={nativeButton}
        {...other}
        onClick={(event) => {
          onClick?.(event);
          open(event.currentTarget, data);
        }}
      />
    );
  }

  return {
    Context,
    useContext: usePopoverContext,
    Provider,
    Trigger,
  };
}
