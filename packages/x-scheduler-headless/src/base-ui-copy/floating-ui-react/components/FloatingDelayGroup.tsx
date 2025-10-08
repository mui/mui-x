import * as React from 'react';
import { useTimeout, Timeout } from '@base-ui-components/utils/useTimeout';
import { useIsoLayoutEffect } from '@base-ui-components/utils/useIsoLayoutEffect';

import { getDelay } from '../hooks/useHover';
import type { FloatingRootContext, Delay } from '../types';
import {
  BaseUIChangeEventDetails,
  createChangeEventDetails,
} from '../../utils/createBaseUIEventDetails';

interface ContextValue {
  hasProvider: boolean;
  timeoutMs: number;
  delayRef: React.MutableRefObject<Delay>;
  initialDelayRef: React.MutableRefObject<Delay>;
  timeout: Timeout;
  currentIdRef: React.MutableRefObject<any>;
  currentContextRef: React.MutableRefObject<{
    onOpenChange: (open: boolean, eventDetails: BaseUIChangeEventDetails<any>) => void;
    setIsInstantPhase: (value: boolean) => void;
  } | null>;
}

const FloatingDelayGroupContext = React.createContext<ContextValue>({
  hasProvider: false,
  timeoutMs: 0,
  delayRef: { current: 0 },
  initialDelayRef: { current: 0 },
  timeout: new Timeout(),
  currentIdRef: { current: null },
  currentContextRef: { current: null },
});

export interface FloatingDelayGroupProps {
  children?: React.ReactNode;
  /**
   * The delay to use for the group when it's not in the instant phase.
   */
  delay: Delay;
  /**
   * An optional explicit timeout to use for the group, which represents when
   * grouping logic will no longer be active after the close delay completes.
   * This is useful if you want grouping to “last” longer than the close delay,
   * for example if there is no close delay at all.
   */
  timeoutMs?: number;
}

/**
 * Experimental next version of `FloatingDelayGroup` to become the default
 * in the future. This component is not yet stable.
 * Provides context for a group of floating elements that should share a
 * `delay`. Unlike `FloatingDelayGroup`, `useDelayGroup` with this
 * component does not cause a re-render of unrelated consumers of the
 * context when the delay changes.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 * @internal
 */
export function FloatingDelayGroup(props: FloatingDelayGroupProps): React.JSX.Element {
  const { children, delay, timeoutMs = 0 } = props;

  const delayRef = React.useRef(delay);
  const initialDelayRef = React.useRef(delay);
  const currentIdRef = React.useRef<string | null>(null);
  const currentContextRef = React.useRef(null);
  const timeout = useTimeout();

  return (
    <FloatingDelayGroupContext.Provider
      value={React.useMemo(
        () => ({
          hasProvider: true,
          delayRef,
          initialDelayRef,
          currentIdRef,
          timeoutMs,
          currentContextRef,
          timeout,
        }),
        [timeoutMs, timeout],
      )}
    >
      {children}
    </FloatingDelayGroupContext.Provider>
  );
}

interface UseDelayGroupOptions {
  /**
   * Whether delay grouping should be enabled.
   * @default true
   */
  enabled?: boolean;
}

interface UseDelayGroupReturn {
  /**
   * The delay reference object.
   */
  delayRef: React.MutableRefObject<Delay>;
  /**
   * Whether animations should be removed.
   */
  isInstantPhase: boolean;
  /**
   * Whether a `<FloatingDelayGroup>` provider is present.
   */
  hasProvider: boolean;
}

/**
 * Enables grouping when called inside a component that's a child of a
 * `FloatingDelayGroup`.
 * @see https://floating-ui.com/docs/FloatingDelayGroup
 * @internal
 */
export function useDelayGroup(
  context: FloatingRootContext,
  options: UseDelayGroupOptions = {},
): UseDelayGroupReturn {
  const { open, onOpenChange, floatingId } = context;
  const { enabled = true } = options;

  const groupContext = React.useContext(FloatingDelayGroupContext);
  const {
    currentIdRef,
    delayRef,
    timeoutMs,
    initialDelayRef,
    currentContextRef,
    hasProvider,
    timeout,
  } = groupContext;

  const [isInstantPhase, setIsInstantPhase] = React.useState(false);

  useIsoLayoutEffect(() => {
    function unset() {
      setIsInstantPhase(false);
      currentContextRef.current?.setIsInstantPhase(false);
      currentIdRef.current = null;
      currentContextRef.current = null;
      delayRef.current = initialDelayRef.current;
    }

    if (!enabled) {
      return undefined;
    }
    if (!currentIdRef.current) {
      return undefined;
    }

    if (!open && currentIdRef.current === floatingId) {
      setIsInstantPhase(false);

      if (timeoutMs) {
        timeout.start(timeoutMs, unset);
        return () => {
          timeout.clear();
        };
      }

      unset();
    }
    return undefined;
  }, [
    enabled,
    open,
    floatingId,
    currentIdRef,
    delayRef,
    timeoutMs,
    initialDelayRef,
    currentContextRef,
    timeout,
  ]);

  useIsoLayoutEffect(() => {
    if (!enabled) {
      return;
    }
    if (!open) {
      return;
    }

    const prevContext = currentContextRef.current;
    const prevId = currentIdRef.current;

    currentContextRef.current = { onOpenChange, setIsInstantPhase };
    currentIdRef.current = floatingId;
    delayRef.current = {
      open: 0,
      close: getDelay(initialDelayRef.current, 'close'),
    };

    if (prevId !== null && prevId !== floatingId) {
      timeout.clear();
      setIsInstantPhase(true);
      prevContext?.setIsInstantPhase(true);
      prevContext?.onOpenChange(false, createChangeEventDetails('none'));
    } else {
      setIsInstantPhase(false);
      prevContext?.setIsInstantPhase(false);
    }
  }, [
    enabled,
    open,
    floatingId,
    onOpenChange,
    currentIdRef,
    delayRef,
    timeoutMs,
    initialDelayRef,
    currentContextRef,
    timeout,
  ]);

  useIsoLayoutEffect(() => {
    return () => {
      currentContextRef.current = null;
    };
  }, [currentContextRef]);

  return React.useMemo(
    () => ({
      hasProvider,
      delayRef,
      isInstantPhase,
    }),
    [hasProvider, delayRef, isInstantPhase],
  );
}
