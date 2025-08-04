'use client';
import * as React from 'react';
import { useEffectEvent } from '@floating-ui/react/utils';
import { useTimeout } from '@base-ui-components/utils/useTimeout';

const ONE_MINUTE_IN_MS = 60 * 1000;

/**
 * Hook that runs a callback function at the start of every minute.
 * @param {() => void} callback The callback function to run.
 */
export function useOnEveryMinuteStart(callback: () => void) {
  const timeout = useTimeout();
  const savedCallback = useEffectEvent(callback);

  React.useEffect(() => {
    let intervalId: ReturnType<typeof setInterval> | null = null;
    const currentDate = new Date();
    const timeUntilNextMinuteMs =
      ONE_MINUTE_IN_MS - (currentDate.getSeconds() * 1000 + currentDate.getMilliseconds());

    timeout.start(timeUntilNextMinuteMs, () => {
      savedCallback();

      intervalId = setInterval(() => {
        savedCallback();
      }, ONE_MINUTE_IN_MS);
    });

    return () => {
      if (intervalId !== null) {
        clearInterval(intervalId);
      }
    };
  }, [timeout, savedCallback]);
}
