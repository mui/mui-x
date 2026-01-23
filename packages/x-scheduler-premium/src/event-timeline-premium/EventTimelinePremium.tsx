'use client';
import * as React from 'react';
import { styled, useThemeProps } from '@mui/material/styles';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useStore } from '@base-ui/utils/store';
import {
  useExtractEventTimelinePremiumParameters,
  useEventTimelinePremium,
} from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { eventTimelinePremiumViewSelectors } from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { EventTimelinePremiumStoreContext } from '@mui/x-scheduler-headless-premium/use-event-timeline-premium-store-context';
import { EventTimelinePremiumView } from '@mui/x-scheduler-headless-premium/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { EventTimelinePremiumProps } from './EventTimelinePremium.types';
import { EventTimelinePremiumContent } from './content';
// TODO: Remove these CSS imports during the MUI X migration
import '../styles/index.css';
import '../styles/colors.css';
import '../styles/tokens.css';
import '../styles/utils.css';

const EventTimelinePremiumRoot = styled('div', {
  name: 'MuiEventTimelinePremium',
  slot: 'Root',
})(({ theme }) => ({
  '--time-cell-width': '64px',
  '--days-cell-width': '120px',
  '--weeks-cell-width': '64px',
  '--months-cell-width': '180px',
  '--years-cell-width': '200px',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(2),
  gap: theme.spacing(2),
  height: '100%',
  fontSize: theme.typography.body2.fontSize,
}));

const EventTimelinePremiumHeaderToolbar = styled('header', {
  name: 'MuiEventTimelinePremium',
  slot: 'HeaderToolbar',
})({
  display: 'flex',
  justifyContent: 'flex-start',
});

export const EventTimelinePremium = React.forwardRef(function EventTimelinePremium<
  TEvent extends object,
  TResource extends object,
>(
  inProps: EventTimelinePremiumProps<TEvent, TResource>,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const props = useThemeProps({ props: inProps, name: 'MuiEventTimelinePremium' });

  const { parameters, forwardedProps } = useExtractEventTimelinePremiumParameters<
    TEvent,
    TResource,
    typeof props
  >(props);
  const store = useEventTimelinePremium(parameters);

  const view = useStore(store, eventTimelinePremiumViewSelectors.view);
  const views = useStore(store, eventTimelinePremiumViewSelectors.views);

  const handleViewChange = (event: SelectChangeEvent) => {
    store.setView(event.target.value as EventTimelinePremiumView, event as Event);
  };

  return (
    <EventTimelinePremiumStoreContext.Provider value={store}>
      <SchedulerStoreContext.Provider value={store as any}>
        <EventTimelinePremiumRoot ref={forwardedRef} {...forwardedProps}>
          <EventTimelinePremiumHeaderToolbar>
            <Select value={view} onChange={handleViewChange} size="small">
              {views.map((viewItem) => (
                <MenuItem key={viewItem} value={viewItem}>
                  {viewItem}
                </MenuItem>
              ))}
            </Select>
          </EventTimelinePremiumHeaderToolbar>
          <EventTimelinePremiumContent />
        </EventTimelinePremiumRoot>
      </SchedulerStoreContext.Provider>
    </EventTimelinePremiumStoreContext.Provider>
  );
}) as EventTimelinePremiumComponent;

type EventTimelinePremiumComponent = <TEvent extends object, TResource extends object>(
  props: EventTimelinePremiumProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
