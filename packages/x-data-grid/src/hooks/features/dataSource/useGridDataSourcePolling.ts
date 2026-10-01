'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';

interface UseGridDataSourcePollingOptions {
  /**
   * The polling interval in milliseconds. The polling is off when it is `0` or less.
   */
  revalidateMs: number;
  /**
   * The polling is off when it is `false`.
   */
  isActive: boolean;
  /**
   * Runs when `<Activity>` shows the grid again, if the polling started before.
   * @returns {boolean} `true` to resume the polling.
   * @default () => true
   */
  shouldResume?: () => boolean;
}

/**
 * Calls a revalidation callback at the `revalidateMs` interval.
 * The polling pauses while `<Activity>` hides the grid and stops after the grid unmounts.
 */
export const useGridDataSourcePolling = ({
  revalidateMs,
  isActive,
  shouldResume = () => true,
}: UseGridDataSourcePollingOptions) => {
  const pollingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const pollingCallbackRef = React.useRef<(() => void) | null>(null);
  // `false` while Activity is hidden or after unmount, so a late response cannot restart polling.
  const isPollingAllowed = React.useRef(true);

  const stopPolling = React.useCallback(() => {
    if (pollingIntervalRef.current !== null) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  const startPolling = useEventCallback((callback: () => void) => {
    stopPolling();
    // Keep the callback while Activity is hidden to resume the polling on show.
    pollingCallbackRef.current = callback;

    if (!isPollingAllowed.current || !isActive || revalidateMs <= 0) {
      return;
    }

    pollingIntervalRef.current = setInterval(callback, revalidateMs);
  });

  React.useEffect(() => {
    if (!isActive || revalidateMs <= 0) {
      stopPolling();
    }
  }, [isActive, revalidateMs, stopPolling]);

  const canResume = useEventCallback(shouldResume);

  React.useEffect(() => {
    isPollingAllowed.current = true;
    // Activity runs the effects again when it shows the grid, so resume the paused polling.
    if (pollingCallbackRef.current && canResume()) {
      startPolling(pollingCallbackRef.current);
    }
    return () => {
      isPollingAllowed.current = false;
      stopPolling();
    };
  }, [startPolling, stopPolling, canResume]);

  return { startPolling, stopPolling };
};
