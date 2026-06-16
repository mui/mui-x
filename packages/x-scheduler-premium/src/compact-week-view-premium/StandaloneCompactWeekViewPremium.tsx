'use client';
import * as React from 'react';
import { useLicenseVerifier, Watermark } from '@mui/x-license/internals';
import { useExtractEventCalendarParameters } from '@mui/x-scheduler-internals/use-event-calendar';
import { EventCalendarPremiumStore } from '@mui/x-scheduler-internals-premium/use-event-calendar-premium';
import { CompactWeekView } from '@mui/x-scheduler/compact-week-view';
import {
  EventCalendarProvider,
  EventEditingOptionalRenderersContext,
  ResponsiveTypographyContainer,
} from '@mui/x-scheduler/internals';
import { PREMIUM_EVENT_DIALOG_OPTIONAL_RENDERERS } from '../internals/eventDialogOptionalRenderers';
import { StandaloneCompactWeekViewPremiumProps } from './CompactWeekViewPremium.types';

const packageInfo = {
  releaseDate: '__RELEASE_INFO__',
  version: process.env.MUI_VERSION!,
  name: 'x-scheduler-premium' as const,
};
const watermark = <Watermark packageInfo={packageInfo} />;

/**
 * Premium version of a touch-optimized Week View (7 days) for narrow widths that can be used
 * outside of the Event Calendar.
 */
const StandaloneCompactWeekViewPremium = React.forwardRef(function StandaloneCompactWeekViewPremium<
  TEvent extends object,
  TResource extends object,
>(
  props: StandaloneCompactWeekViewPremiumProps<TEvent, TResource>,
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
          <CompactWeekView ref={forwardedRef} {...forwardedProps} />
        </EventEditingOptionalRenderersContext.Provider>
        {watermark}
      </EventCalendarProvider>
    </ResponsiveTypographyContainer>
  );
}) as StandaloneCompactWeekViewPremiumComponent;

export { StandaloneCompactWeekViewPremium };

interface StandaloneCompactWeekViewPremiumComponent {
  <TEvent extends object, TResource extends object>(
    props: StandaloneCompactWeekViewPremiumProps<TEvent, TResource> & {
      ref?: React.ForwardedRef<HTMLDivElement>;
    },
  ): React.JSX.Element;
  propTypes?: any;
}
