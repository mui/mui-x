/* eslint-disable react-compiler/react-compiler -- intentional `react-hooks/exhaustive-deps` disable below */
import * as React from 'react';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import type { SchedulerDataSource } from '@mui/x-scheduler-internals/internals';
import type { EventCalendarPremiumParameters } from './EventCalendarPremiumStore.types';

/**
 * Extracts the Event Calendar Premium parameters from the props.
 * Wraps the community extraction hook and pulls the Premium-only `dataSource` out of the
 * forwarded props, so it reaches the Premium store instead of landing on the DOM.
 */
export function useExtractEventCalendarPremiumParameters<
  TEvent extends object,
  TResource extends object,
  P extends EventCalendarPremiumParameters<TEvent, TResource>,
>(props: P): UseExtractEventCalendarPremiumParametersReturnValue<TEvent, TResource, P> {
  const { parameters: baseParameters, forwardedProps: baseForwardedProps } =
    useExtractEventCalendarParameters<TEvent, TResource, P>(props);

  // `Omit<P, keyof EventCalendarParameters>` is opaque for a generic `P`, so the Premium-only
  // key is re-surfaced with a local cast before being destructured.
  const { dataSource, ...forwardedProps } = baseForwardedProps as {
    dataSource?: SchedulerDataSource<TEvent>;
  } & Omit<P, keyof EventCalendarPremiumParameters<TEvent, TResource>>;

  const parameters: EventCalendarPremiumParameters<TEvent, TResource> = React.useMemo(
    () => ({ ...baseParameters, dataSource }),
    // `dataSource` is intentionally excluded. It's re-read on every fetch, but the
    // cache + dataManager are pinned to the original instance, so runtime swaps are
    // only partially reactive — consumers should remount to swap. Including it in
    // deps would invalidate the memo every render for inline `{ getEvents, persistEvents }`.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [baseParameters],
  );

  return {
    parameters,
    forwardedProps: forwardedProps as Omit<
      P,
      keyof EventCalendarPremiumParameters<TEvent, TResource>
    >,
  };
}

interface UseExtractEventCalendarPremiumParametersReturnValue<
  TEvent extends object,
  TResource extends object,
  P extends EventCalendarPremiumParameters<TEvent, TResource>,
> {
  parameters: EventCalendarPremiumParameters<TEvent, TResource>;
  forwardedProps: Omit<P, keyof EventCalendarPremiumParameters<TEvent, TResource>>;
}
