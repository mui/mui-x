import * as React from 'react';
import { styled } from '@mui/material/styles';
import { eventTimelinePremiumClasses } from '@mui/x-scheduler-premium/event-timeline-premium';
import {
  EventTimelinePremiumContent,
  EventTimelinePremiumStyledContext,
  EventTimelinePremiumFeaturesContext,
  useFrozenEventTimelinePremiumFeatures,
} from '@mui/x-scheduler-premium/internals';
import {
  useEventTimelinePremium,
  useExtractEventTimelinePremiumParameters,
} from '@mui/x-scheduler-internals-premium/use-event-timeline-premium';

import { SchedulerStoreContext } from '@mui/x-scheduler-internals/use-scheduler-store-context';
import {
  ErrorContainer,
  EventEditingStyledContext,
  SharedComponentsStyledContext,
  SchedulerSlotsProvider,
  SchedulerDirectionProvider,
  EVENT_TIMELINE_DEFAULT_LOCALE_TEXT,
} from '@mui/x-scheduler/internals';

// Same styles as the root of `EventTimelinePremium`.
const DependenciesTimelineRoot = styled('div')(({ theme }) => ({
  boxSizing: 'border-box',
  '*, *::before, *::after': {
    boxSizing: 'inherit',
  },
  position: 'relative',
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  height: '100%',
  minHeight: 0,
  overflow: 'hidden',
  fontFamily: theme.typography.fontFamily,
  fontSize: theme.typography.body2.fontSize,
}));

const sharedStyledContextValue = { classes: eventTimelinePremiumClasses };

/**
 * Stands in for `EventTimelinePremium`, which doesn't accept the `dependencies` props yet.
 * Renders the same content and providers from the same store.
 */
export function DependenciesTimeline(props) {
  const {
    parameters,
    forwardedProps: {
      dependencies,
      onDependenciesChange,
      features: featuresProp,
      localeText,
      resourceColumnLabel,
      getEventAriaLabel,
      slots,
      slotProps,
      ...other
    },
  } = useExtractEventTimelinePremiumParameters(props);
  const { features, storeFeatures } =
    useFrozenEventTimelinePremiumFeatures(featuresProp);
  const storeParameters = React.useMemo(
    () => ({ ...parameters, dependencies, onDependenciesChange, storeFeatures }),
    [parameters, dependencies, onDependenciesChange, storeFeatures],
  );
  const store = useEventTimelinePremium(storeParameters);

  const schedulerId = React.useId();
  const styledContextValue = React.useMemo(
    () => ({
      schedulerId,
      classes: eventTimelinePremiumClasses,
      localeText: { ...EVENT_TIMELINE_DEFAULT_LOCALE_TEXT, ...localeText },
      resourceColumnLabel,
      getEventAriaLabel,
    }),
    [schedulerId, localeText, resourceColumnLabel, getEventAriaLabel],
  );

  return (
    // The context is typed on the base store and the store generic is invariant.
    <SchedulerStoreContext.Provider value={store}>
      <EventTimelinePremiumFeaturesContext.Provider value={features}>
        <EventTimelinePremiumStyledContext.Provider value={styledContextValue}>
          <EventEditingStyledContext.Provider value={styledContextValue}>
            <SharedComponentsStyledContext.Provider value={sharedStyledContextValue}>
              <SchedulerSlotsProvider slots={slots} slotProps={slotProps}>
                <SchedulerDirectionProvider>
                  <DependenciesTimelineRoot
                    className={eventTimelinePremiumClasses.root}
                    {...other}
                  >
                    <EventTimelinePremiumContent />
                    <ErrorContainer />
                  </DependenciesTimelineRoot>
                </SchedulerDirectionProvider>
              </SchedulerSlotsProvider>
            </SharedComponentsStyledContext.Provider>
          </EventEditingStyledContext.Provider>
        </EventTimelinePremiumStyledContext.Provider>
      </EventTimelinePremiumFeaturesContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}
