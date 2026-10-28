'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useStore } from '@base-ui/utils/store';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import {
  schedulerEventSelectors,
  schedulerOtherSelectors,
} from '@mui/x-scheduler-internals/scheduler-selectors';
import { Button } from '@base-ui/react/button';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import type { SchedulerEventOccurrence } from '@mui/x-scheduler-internals/models';
import { useEventAccessibleName } from '../../../hooks/useEventAccessibleName';
import type { EventItemProps } from './EventItem.types';
import { useFormatTime } from '../../../hooks/useFormatTime';
import { useEventCalendarStyledContext } from '../../../../event-calendar/EventCalendarStyledContext';
import type { PaletteName } from '../../../utils/tokens';
import { getPaletteVariants } from '../../../utils/tokens';
import { getArrowEdgeStyles, getArrowFocusVisibleStyles } from '../arrowClips';
import { isOccurrenceMultiDay } from '../../../utils/event-utils';
import { formatProcessedDate } from '../../../utils/date-utils';

const EventItemCard = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'EventItemCard',
})<{ 'data-variant'?: 'compact' | 'filled' | 'regular'; palette?: PaletteName }>(({ theme }) => ({
  padding: 0,
  borderRadius: theme.shape.borderRadius,
  cursor: 'pointer',
  '&:hover': {
    backgroundColor: (theme.vars || theme).palette.action.hover,
  },
  '&:focus-visible': {
    outline: '2px solid var(--event-surface-accent)',
    outlineOffset: 1,
  },
  '&[data-variant="compact"], &[data-variant="regular"]': {
    containerType: 'inline-size',
    height: 'fit-content',
  },
  '&[data-variant="filled"]': {
    backgroundColor: 'var(--event-surface-bold)',
    color: 'var(--event-on-surface-bold)',
    '&:hover': {
      backgroundColor: 'var(--event-surface-bold-hover)',
    },
    '&[data-editing]': {
      backgroundColor: 'var(--event-surface-selected)',
      color: 'var(--event-on-surface-selected)',
      '&:hover': {
        backgroundColor: 'var(--event-surface-selected-hover)',
      },
    },
    ...getArrowEdgeStyles(theme),
    ...getArrowFocusVisibleStyles(theme.shape.borderRadius),
  },
  '&[data-editing]': {
    backgroundColor: 'var(--event-surface-selected)',
    '&:hover': {
      backgroundColor: 'var(--event-surface-selected-hover)',
    },
  },
  variants: getPaletteVariants(theme),
}));

const EventItemCardWrapper = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'EventItemCardWrapper',
})<{ 'data-variant'?: 'compact' | 'filled' | 'regular' }>(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  padding: theme.spacing(0.5, 1),
  '&[data-variant="compact"], &[data-variant="filled"]': {
    padding: `0 ${theme.spacing(0.5)}`,
  },
}));

const EventItemTitle = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'EventItemTitle',
})(({ theme }) => ({
  margin: 0,
  color: (theme.vars || theme).palette.text.primary,
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: 'var(--EventCalendar-fontSize-eventTitle, 0.75rem)',
  lineHeight: 1.43,
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
}));

const EventItemTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'EventItemTime',
})<{ 'data-compact'?: boolean }>(({ theme }) => ({
  display: 'inline-block',
  color: (theme.vars || theme).palette.text.secondary,
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
  whiteSpace: 'nowrap',
  width: 150,
  '&[data-compact]': {
    width: 'fit-content',
    marginInlineEnd: theme.spacing(0.5),
  },
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
}));

const EventItemRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventCalendar',
  slot: 'EventItemRecurringIcon',
})(({ theme }) => ({
  color: (theme.vars || theme).palette.text.primary,
  '[data-editing] &': {
    color: 'var(--event-on-surface-selected)',
  },
}));

const ResourceLegendColor = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'ResourceLegendColor',
})({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-main)',
  '[data-editing] &': {
    backgroundColor: 'var(--event-on-surface-selected)',
  },
});

const EventItemCardContent = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'EventItemCardContent',
})({
  margin: 0,
  height: 20,
  lineHeight: '20px',
});

const EventItemLinesClamp = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'EventItemLinesClamp',
})({
  display: '-webkit-box',
  WebkitLineClamp: 'var(--number-of-lines)',
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
  wordBreak: 'break-word',
  overflowWrap: 'break-word',
});

/**
 * Component used to display an event occurrence, without any positioning capabilities
 * Used in <AgendaView /> and in the event popover of <MonthView /> to display the list of events for a specific day.
 */
export const EventItem = React.forwardRef(function EventItem(
  props: EventItemProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, date, variant = 'regular', className, onClick, ...other } = props;

  // Context hooks
  const { classes, localeText } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const isEditing = useStore(store, schedulerOtherSelectors.isEditedOccurrence, occurrence.key);

  // Selector hooks
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id, undefined);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);

  const formatTime = useFormatTime();
  const accessibleName = useEventAccessibleName({
    occurrence,
    isRecurring,
    localeText,
  });

  // The keys of the processed dates only depend on their day in the display timezone.
  const { start, end } = occurrence.displayTimezone;
  const startsBeforeDay = start.key !== date.key && start.timestamp < date.timestamp;
  const endsAfterDay = end.key !== date.key && end.timestamp > date.timestamp;

  const content = React.useMemo(() => {
    switch (variant) {
      case 'compact':
        return (
          <React.Fragment>
            <ResourceLegendColor className={classes.resourceLegendColor} aria-hidden="true" />
            <EventItemLinesClamp
              className={classes.eventItemLinesClamp}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              <EventItemCardContent className={classes.eventItemCardContent}>
                <EventItemTime className={classes.eventItemTime} data-compact>
                  <span>{formatTime(occurrence.displayTimezone.start)}</span>
                </EventItemTime>
                <EventItemTitle className={classes.eventItemTitle}>
                  {occurrence.title}
                </EventItemTitle>
              </EventItemCardContent>
            </EventItemLinesClamp>
          </React.Fragment>
        );

      case 'filled':
        return (
          <EventItemLinesClamp
            className={classes.eventItemLinesClamp}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            <EventItemTitle className={classes.eventItemTitle}>{occurrence.title}</EventItemTitle>
          </EventItemLinesClamp>
        );
      case 'regular':
        return (
          <React.Fragment>
            <ResourceLegendColor className={classes.resourceLegendColor} aria-hidden="true" />
            <EventItemLinesClamp
              className={classes.eventItemLinesClamp}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              <EventItemCardContent className={classes.eventItemCardContent}>
                <MultiDayDateLabel occurrence={occurrence} formatTime={formatTime} />
                <EventItemTitle className={classes.eventItemTitle}>
                  {occurrence.title}
                </EventItemTitle>
              </EventItemCardContent>
            </EventItemLinesClamp>
          </React.Fragment>
        );
      default:
        throw new Error(
          'MUI X Scheduler: Unsupported variant provided to EventItem component. ' +
            'The EventItem component only supports specific variant values. ' +
            'Check the component documentation for supported variants.',
        );
    }
  }, [variant, formatTime, occurrence, classes]);

  return (
    <Button
      nativeButton={false}
      onClick={onClick}
      render={
        <EventItemCard
          ref={forwardedRef}
          data-variant={variant}
          data-palette={color}
          data-editing={isEditing || undefined}
          // Read by the agenda's delete-focus fallback (`captureFocusFallback`).
          data-event-id={occurrence.id}
          // Read by the agenda's delete-focus fallback (`captureFocusFallback`).
          data-occurrence-timestamp={occurrence.dataTimezone.start.timestamp}
          aria-label={accessibleName}
          {...(startsBeforeDay ? { 'data-starting-before-edge': '' } : {})}
          {...(endsAfterDay ? { 'data-ending-after-edge': '' } : {})}
          {...other}
          className={clsx(className, classes.eventItemCard, occurrence.className)}
        />
      }
    >
      <EventItemCardWrapper className={classes.eventItemCardWrapper} data-variant={variant}>
        {content}
        {isRecurring && (
          <EventItemRecurringIcon
            className={classes.eventItemRecurringIcon}
            aria-hidden="true"
            fontSize="small"
          />
        )}
      </EventItemCardWrapper>
    </Button>
  );
});

function MultiDayDateLabel(props: {
  occurrence: SchedulerEventOccurrence;
  formatTime: ReturnType<typeof useFormatTime>;
}) {
  const { occurrence, formatTime } = props;

  const store = useEventCalendarStoreContext();
  const locale = useStore(store, schedulerOtherSelectors.dateLocale);
  const { classes, localeText } = useEventCalendarStyledContext();

  if (isOccurrenceMultiDay(occurrence)) {
    const { end, timezone } = occurrence.displayTimezone;
    return (
      <EventItemTime className={classes.eventItemTime} as="span">
        {localeText.eventItemMultiDayLabel(
          formatProcessedDate(locale, end, timezone, 'monthShortAndDayOfMonth'),
        )}
      </EventItemTime>
    );
  }
  if (occurrence.allDay) {
    return (
      <EventItemTime className={classes.eventItemTime} as="span">
        {localeText.allDay}
      </EventItemTime>
    );
  }
  return (
    <EventItemTime className={classes.eventItemTime}>
      <span>{formatTime(occurrence.displayTimezone.start)}</span>
      <span> - {formatTime(occurrence.displayTimezone.end)}</span>
    </EventItemTime>
  );
}
