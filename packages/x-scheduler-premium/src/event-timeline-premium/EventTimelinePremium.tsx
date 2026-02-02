'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled, useThemeProps } from '@mui/material/styles';
import composeClasses from '@mui/utils/composeClasses';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { useStore } from '@base-ui/utils/store';
import {
  useExtractEventTimelinePremiumParameters,
  useEventTimelinePremium,
} from '@mui/x-scheduler-headless-premium/use-event-timeline-premium';
import { eventTimelinePremiumViewSelectors } from '@mui/x-scheduler-headless-premium/event-timeline-premium-selectors';
import { EventTimelinePremiumView } from '@mui/x-scheduler-headless-premium/models';
import { SchedulerStoreContext } from '@mui/x-scheduler-headless/use-scheduler-store-context';
import { eventDialogSlots, EventDialogClassesContext } from '@mui/x-scheduler/internals';
import { EventTimelinePremiumProps } from './EventTimelinePremium.types';
import { EventTimelinePremiumContent } from './content';
import {
  EventTimelinePremiumClasses,
  getEventTimelinePremiumUtilityClass,
} from './eventTimelinePremiumClasses';
import { EventTimelinePremiumClassesContext } from './EventTimelinePremiumClassesContext';
// TODO: Remove these CSS imports during the MUI X migration
import '../styles/index.css';
import '../styles/colors.css';
import '../styles/tokens.css';

const useUtilityClasses = (classes: Partial<EventTimelinePremiumClasses> | undefined) => {
  const slots = {
    root: ['root'],
    headerToolbar: ['headerToolbar'],
    content: ['content'],
    grid: ['grid'],
    titleSubGridWrapper: ['titleSubGridWrapper'],
    titleSubGrid: ['titleSubGrid'],
    titleSubGridHeaderRow: ['titleSubGridHeaderRow'],
    titleSubGridHeaderCell: ['titleSubGridHeaderCell'],
    eventsSubGridWrapper: ['eventsSubGridWrapper'],
    eventsSubGrid: ['eventsSubGrid'],
    eventsSubGridHeaderRow: ['eventsSubGridHeaderRow'],
    eventsSubGridRow: ['eventsSubGridRow'],
    titleCellRow: ['titleCellRow'],
    titleCell: ['titleCell'],
    titleCellLegendColor: ['titleCellLegendColor'],
    event: ['event'],
    eventResizeHandler: ['eventResizeHandler'],
    eventLinesClamp: ['eventLinesClamp'],
    timeHeader: ['timeHeader'],
    timeHeaderCell: ['timeHeaderCell'],
    timeHeaderDayLabel: ['timeHeaderDayLabel'],
    timeHeaderCellsRow: ['timeHeaderCellsRow'],
    timeHeaderTimeCell: ['timeHeaderTimeCell'],
    timeHeaderTimeLabel: ['timeHeaderTimeLabel'],
    daysHeader: ['daysHeader'],
    daysHeaderCell: ['daysHeaderCell'],
    daysHeaderTime: ['daysHeaderTime'],
    daysHeaderWeekDay: ['daysHeaderWeekDay'],
    daysHeaderDayNumber: ['daysHeaderDayNumber'],
    daysHeaderMonthStart: ['daysHeaderMonthStart'],
    daysHeaderMonthStartLabel: ['daysHeaderMonthStartLabel'],
    weeksHeader: ['weeksHeader'],
    weeksHeaderCell: ['weeksHeaderCell'],
    weeksHeaderDayLabel: ['weeksHeaderDayLabel'],
    weeksHeaderDaysRow: ['weeksHeaderDaysRow'],
    weeksHeaderDayCell: ['weeksHeaderDayCell'],
    monthsHeader: ['monthsHeader'],
    monthsHeaderYearLabel: ['monthsHeaderYearLabel'],
    monthsHeaderMonthLabel: ['monthsHeaderMonthLabel'],
    yearsHeader: ['yearsHeader'],
    yearsHeaderYearLabel: ['yearsHeaderYearLabel'],
    ...eventDialogSlots,
  };

  return composeClasses(slots, getEventTimelinePremiumUtilityClass, classes);
};

const EventTimelinePremiumRoot = styled('div', {
  name: 'MuiEventTimeline',
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
  name: 'MuiEventTimeline',
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
  // We don't want the plan suffix in the theme, otherwise we couldn't share the theme entry across packages
  // eslint-disable-next-line mui/material-ui-name-matches-component-name
  const props = useThemeProps({ props: inProps, name: 'MuiEventTimeline' });

  const {
    parameters,
    forwardedProps: { className, classes: classesProp, ...forwardedProps },
  } = useExtractEventTimelinePremiumParameters<TEvent, TResource, typeof props>(props);
  const store = useEventTimelinePremium(parameters);
  const classes = useUtilityClasses(classesProp);

  const view = useStore(store, eventTimelinePremiumViewSelectors.view);
  const views = useStore(store, eventTimelinePremiumViewSelectors.views);

  const handleViewChange = (event: SelectChangeEvent) => {
    store.setView(event.target.value as EventTimelinePremiumView, event as Event);
  };

  return (
    <SchedulerStoreContext.Provider value={store as any}>
      <EventTimelinePremiumClassesContext.Provider value={classes}>
        <EventDialogClassesContext.Provider value={classes}>
          <EventTimelinePremiumRoot
            ref={forwardedRef}
            className={clsx(classes.root, className)}
            {...forwardedProps}
          >
            <EventTimelinePremiumHeaderToolbar className={classes.headerToolbar}>
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
        </EventDialogClassesContext.Provider>
      </EventTimelinePremiumClassesContext.Provider>
    </SchedulerStoreContext.Provider>
  );
}) as EventTimelinePremiumComponent;

type EventTimelinePremiumComponent = <TEvent extends object, TResource extends object>(
  props: EventTimelinePremiumProps<TEvent, TResource> & {
    ref?: React.ForwardedRef<HTMLDivElement>;
  },
) => React.JSX.Element;
