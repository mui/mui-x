'use client';
import * as React from 'react';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { EventManager } from '@mui/x-internals/EventManager';
import {
  ContextValue,
  CreateModalConfig,
  ModalState,
  ProviderProps,
  TriggerProps,
} from './createModal.types';

export function createModal<TData>(config: CreateModalConfig) {
  const Context = React.createContext<ContextValue<TData> | undefined>(undefined);

  function useModalContext() {
    const context = React.useContext(Context);
    if (!context) {
      throw new Error(
        `MUI: \`${config.contextName}\` is missing. Hook must be placed within its Provider.`,
      );
    }
    return context;
  }

  function Provider(props: ProviderProps<TData>) {
    const { children, render, onClose: onCloseProp } = props;
    const anchorRef = React.useRef<HTMLElement | null>(null);
    const eventManager = React.useRef(new EventManager());

    const [state, setState] = React.useState<ModalState<TData>>({
      isOpen: false,
      data: null,
    });

    const onOpen = useStableCallback(
      (forwardedAnchorRef: React.RefObject<HTMLElement | null>, data: TData) => {
        anchorRef.current = forwardedAnchorRef?.current ?? null;
        setState({ isOpen: true, data });
        eventManager.current.emit('open', { data, anchorRef: anchorRef.current });
      },
    );

    const onClose = useStableCallback(() => {
      onCloseProp?.();
      setState({ isOpen: false, data: null });
      eventManager.current.emit('close');
    });

    const subscribeCloseHandler = React.useCallback((handler: () => void) => {
      eventManager.current.on('close', handler);
      return () => {
        eventManager.current.removeListener('close', handler);
      };
    }, []);

    const contextValue = React.useMemo(
      () => ({ onOpen, onClose, isOpen: state.isOpen || false, subscribeCloseHandler }),
      [onOpen, onClose, state.isOpen, subscribeCloseHandler],
    );

    return (
      <Context.Provider value={contextValue}>
        {children}
        {state.data &&
          anchorRef.current &&
          render({
            isOpen: Boolean(state.isOpen),
            anchorRef,
            data: state.data,
            onClose,
          })}
      </Context.Provider>
    );
  }

  const Trigger = React.forwardRef(function Trigger(
    props: TriggerProps<TData>,
    ref: React.ForwardedRef<HTMLElement | null>,
  ) {
    const { data, onClick, children } = props;
    const { onOpen } = useModalContext();

    return React.cloneElement(children as React.ReactElement<any>, {
      ref,
      onClick: (event: React.MouseEvent) => {
        onClick?.(event);
        onOpen(ref as React.RefObject<HTMLElement | null>, data);
      },
    });
  });

  return {
    Context,
    useContext: useModalContext,
    Provider,
    Trigger,
  };
}
