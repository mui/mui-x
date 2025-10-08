'use client';
import * as React from 'react';
import { Popover } from '@base-ui-components/react/popover';
import { useEventCallback } from '@base-ui-components/utils/useEventCallback';
import {
  ContextValue,
  CreatePopoverComponentsConfig,
  PopoverState,
  ProviderProps,
  TriggerProps,
} from './Popover.types';

export function createPopoverComponents<TAnchorData>(
  config: CreatePopoverComponentsConfig<TAnchorData>,
) {
  const Context = React.createContext<ContextValue<TAnchorData> | undefined>(undefined);

  function usePopoverContext(): ContextValue<TAnchorData> {
    const context = React.useContext(Context);
    if (context === undefined) {
      throw new Error(
        `Scheduler: \`${config.contextName}\` is missing. Hook must be placed within Provider.`,
      );
    }
    return context;
  }

  function Provider(props: ProviderProps<TAnchorData>) {
    const { containerRef, children, renderPopover, onClose: onCloseProp, modal = false } = props;
    const [state, setState] = React.useState<PopoverState<TAnchorData>>({
      isOpen: false,
      anchor: null,
      data: null,
      keepOpen: false,
    });

    const open = useEventCallback((anchor: HTMLElement, data: TAnchorData) => {
      setState((prevState) => ({ ...prevState, isOpen: true, anchor, data }));
    });
    const setKeepOpen = React.useCallback((value: boolean) => {
      setState((prevState) => ({ ...prevState, keepOpen: value }));
    }, []);

    const close = useEventCallback((isOpen, eventDetails) => {
      console.log('CLOSING POPOVER', config.contextName, isOpen, eventDetails);
      if (!state.isOpen || state.keepOpen) {
        return;
      }
      onCloseProp?.();
      setState((prevState) => ({ ...prevState, isOpen: false, anchor: null, data: null }));
    });

    const contextValue = React.useMemo<ContextValue<TAnchorData>>(
      () => ({
        open,
        close,
        isOpen: state.isOpen,
        setKeepOpen,
      }),
      [open, close, state.isOpen, setKeepOpen],
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
