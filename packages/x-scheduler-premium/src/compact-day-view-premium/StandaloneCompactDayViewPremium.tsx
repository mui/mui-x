'use client';
import * as React from 'react';
import { useLicenseVerifier, Watermark } from '@mui/x-license/internals';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import { EventCalendarPremiumStore } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { CompactDayView } from '@mui/x-scheduler/compact-day-view';
import {
  EventCalendarProvider,
  EventEditingOptionalRenderersContext,
  ResponsiveTypographyContainer,
} from '@mui/x-scheduler/internals';
import { PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS } from '../internals/eventDialogOptionalRenderers';
import { StandaloneCompactDayViewPremiumProps } from './CompactDayViewPremium.types';

const packageInfo = {
  releaseDate: '__RELEASE_INFO__',
  version: process.env.MUI_VERSION!,
  name: 'x-scheduler-premium' as const,
};
const watermark = <Watermark packageInfo={packageInfo} />;

/**
 * Premium version of a touch-optimized Day View (1 day) for narrow widths that can be used
 * outside of the Event Calendar.
 */
const StandaloneCompactDayViewPremium = React.forwardRef(function StandaloneCompactDayViewPremium<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneCompactDayViewPremiumProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  useLicenseVerifier(packageInfo);

  const { parameters, forwardedProps } = useExtractEventCalendarParameters<
    TEvent,
    TResource,
    typeof props
  >(props);

  return (
    <ResponsiveTypographyContainer>
      <EventCalendarProvider {...parameters} storeClass={EventCalendarPremiumStore}>
        <EventEditingOptionalRenderersContext.Provider
          value={PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS}
        >
          <CompactDayView ref={forwardedRef} {...forwardedProps} />
        </EventEditingOptionalRenderersContext.Provider>
        {watermark}
      </EventCalendarProvider>
    </ResponsiveTypographyContainer>
  );
}) as StandaloneCompactDayViewPremiumComponent;

export { StandaloneCompactDayViewPremium };

interface StandaloneCompactDayViewPremiumComponent {
  <TEvent extends object, TResource extends object>(
    props: StandaloneCompactDayViewPremiumProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
