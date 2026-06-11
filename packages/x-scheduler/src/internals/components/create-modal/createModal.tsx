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
        `MUI X Scheduler: \`${config.contextName}\` is missing. Hook must be placed within its Provider.`,
      );
    }
    return context;
  }

  const EMPTY_ANCHOR_REF: React.RefObject<HTMLElement | null> = { current: null };

  function Provider(props: ProviderProps<TData>) {
    const { children, render, onOpen: onOpenProp, onClose: onCloseProp, imperativeRef } = props;
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
        onOpenProp?.(data);
        eventManager.current.emit('open', { data, anchorRef: anchorRef.current });
      },
    );

    const onClose = useStableCallback(() => {
      onCloseProp?.();
      setState({ isOpen: false, data: null });
      eventManager.current.emit('close');
    });

    React.useImperativeHandle(
      imperativeRef,
      () => ({
        open(data: TData, forwardedAnchorRef?: React.RefObject<HTMLElement | null>) {
          onOpen(forwardedAnchorRef ?? EMPTY_ANCHOR_REF, data);
        },
        close() {
          onClose();
        },
      }),
      [onOpen, onClose],
    );

    const subscribeCloseHandler = React.useCallback((handler: () => void) => {
      eventManager.current.on('close', handler);
      return () => {
        eventManager.current.removeListener('close', handler);
      };
    }, []);

    const contextValue = React.useMemo(
      () => ({
        onOpen,
        onClose,
        isOpen: state.isOpen || false,
        data: state.data,
        subscribeCloseHandler,
      }),
      [onOpen, onClose, state.isOpen, state.data, subscribeCloseHandler],
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
    const { onOpen, onClose, isOpen, data: currentData } = useModalContext();

    return React.cloneElement(children as React.ReactElement<any>, {
      ref,
      onClick: (event: React.MouseEvent) => {
        onClick?.(event);
        const dataKey = (data as any)?.key;
        const currentKey = (currentData as any)?.key;
        if (isOpen && dataKey != null && dataKey === currentKey) {
          onClose();
        } else {
          onOpen(ref as React.RefObject<HTMLElement | null>, data);
        }
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
