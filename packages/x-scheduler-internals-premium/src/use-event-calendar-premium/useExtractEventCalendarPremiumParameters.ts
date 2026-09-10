/* eslint-disable react-compiler/react-compiler -- intentional `react-hooks/exhaustive-deps` disable below */
import * as React from 'react';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import type { EventCalendarPremiumParameters } from './EventCalendarPremiumStore.types';

/**
 * Extracts the Event Calendar Premium parameters from the props.
 * Wraps the community hook, taking care of the Premium-only parameters it does not know about.
 */
export function useExtractEventCalendarPremiumParameters<
  TEvent extends object,
  TResource extends object,
  P extends EventCalendarPremiumParameters<TEvent, TResource>,
>(props: P): UseExtractEventCalendarPremiumParametersReturnValue<TEvent, TResource, P> {
  const { dataSource, ...communityProps } = props;

  const { parameters: baseParameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    Omit<P, 'dataSource'>
  >(communityProps);

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
    // Already `Omit<Omit<P, 'dataSource'>, keyof EventCalendarParameters>`, which TypeScript
    // cannot reduce to the equivalent flat `Omit` while `P` is generic.
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
