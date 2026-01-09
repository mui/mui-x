'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import {
  ContextValue,
  CreateDialogConfig,
  DialogState,
  ProviderProps,
  TriggerProps,
} from './createDialog.types';

export function createDialog<TData>(config: CreateDialogConfig) {
  const Context = React.createContext<ContextValue<TData> | undefined>(undefined);

  function useDialogContext() {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error(
        `Scheduler: \`${config.contextName}\` is missing. Hook must be placed within its Provider.`,
      );
    }
    return context;
  }

  function Provider(props: ProviderProps<TData>) {
    const { children, render, onClose: onCloseProp } = props;

    const [state, setState] = React.useState<DialogState<TData>>({
      isOpen: false,
      anchor: null,
      data: null,
    });

    const open = useStableCallback((anchor: HTMLElement, data: TData) => {
      setState({ isOpen: true, anchor, data });
    });

    const close = useStableCallback(() => {
      onCloseProp?.();
      setState((prev) => ({ ...prev, isOpen: false }));
    });

    const contextValue = React.useMemo(
      () => ({ open, close, isOpen: state.isOpen }),
      [open, close, state.isOpen],
    );

    return (
      <Context.Provider value={contextValue}>
        {children}
        {state.isOpen &&
          state.data &&
          state.anchor &&
          render({
            isOpen: state.isOpen,
            anchor: state.anchor,
            data: state.data,
            onClose: close,
          })}
      </Context.Provider>
    );
  }

  function Trigger(props: TriggerProps<TData>) {
    const { data, onClick, children } = props;
    const { open } = useDialogContext();

    return React.cloneElement(children as React.ReactElement<any>, {
      onClick: (event: React.MouseEvent) => {
        onClick?.(event);
        open(event.currentTarget as HTMLElement, data);
      },
    });
  }

  return {
    Context,
    useContext: useDialogContext,
    Provider,
    Trigger,
  };
}
