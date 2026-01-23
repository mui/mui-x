'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useId } from '@base-ui/utils/useId';
import { useStore } from '@base-ui/utils/store';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import {
  schedulerEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useAdapter } from '@mui/x-scheduler-headless/use-adapter';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { SchedulerEventOccurrence } from '@mui/x-scheduler-headless/models';
import { EventItemProps } from './EventItem.types';
import { useTranslations } from '../../../utils/TranslationsContext';
import { useFormatTime } from '../../../hooks/useFormatTime';
import { schedulerPaletteStyles } from '../../../utils/tokens';
import { useEventCalendarClasses } from '../../../../event-calendar/EventCalendarClassesContext';

const EventItemCard = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'EventItemCard',
})<{ 'data-variant'?: 'compact' | 'filled' | 'regular' }>(({ theme }) => ({
  padding: 0,
  borderRadius: theme.shape.borderRadius,
  backgroundColor: 'var(--event-color-3)',
  '&[data-variant="compact"], &[data-variant="regular"]': {
    '&:active': {
      backgroundColor: 'var(--interactive-active-bg)',
    },
    '&:hover': {
      backgroundColor: 'var(--interactive-hover-bg)',
    },
  },
  '&[data-variant="filled"]': {
    backgroundColor: 'var(--event-color-3)',
    color: 'var(--event-color-12)',
  },
  '&[data-variant="compact"]': {
    containerType: 'inline-size',
    cursor: 'pointer',
    height: 'fit-content',
  },
  ...schedulerPaletteStyles,
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
  color: 'var(--event-color-12)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
}));

const EventItemTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'EventItemTime',
})<{ 'data-compact'?: boolean }>(({ theme }) => ({
  display: 'inline-block',
  color: 'var(--event-color-11)',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
  whiteSpace: 'nowrap',
  width: 150,
  '&[data-compact]': {
    width: 'fit-content',
    marginInlineEnd: theme.spacing(0.5),
  },
}));

const EventItemRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventCalendar',
  slot: 'EventItemRecurringIcon',
})({
  color: 'var(--event-color-11)',
});

const ResourceLegendColor = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'ResourceLegendColor',
})({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
});

const EventItemCardContent = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'EventItemCardContent',
})({
  margin: 0,
  height: 20,
  lineHeight: '20px',
});

const LinesClamp = styled('span')({
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
  const { occurrence, ariaLabelledBy, id: idProp, variant = 'regular', ...other } = props;

  // Context hooks
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();
  const classes = useEventCalendarClasses();

  // State hooks
  const id = useId(idProp);

  // Selector hooks
  const resource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    occurrence.resource,
  );
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);

  const formatTime = useFormatTime();

  const content = React.useMemo(() => {
    switch (variant) {
      case 'compact':
        return (
          <React.Fragment>
            <ResourceLegendColor
              className={classes.resourceLegendColor}
              role="img"
              aria-label={
                resource?.title
                  ? translations.resourceAriaLabel(resource.title)
                  : translations.noResourceAriaLabel
              }
            />
            <LinesClamp style={{ '--number-of-lines': 1 } as React.CSSProperties}>
              <EventItemCardContent className={classes.eventItemCardContent}>
                <EventItemTime className={classes.eventItemTime} data-compact>
                  <span>{formatTime(occurrence.displayTimezone.start.value)}</span>
                </EventItemTime>
                <EventItemTitle className={classes.eventItemTitle}>{occurrence.title}</EventItemTitle>
              </EventItemCardContent>
            </LinesClamp>
            {isRecurring && <EventItemRecurringIcon className={classes.eventItemRecurringIcon} aria-hidden="true" fontSize="small" />}
          </React.Fragment>
        );

      case 'filled':
        return (
          <React.Fragment>
            <LinesClamp style={{ '--number-of-lines': 1 } as React.CSSProperties}>
              <EventItemTitle className={classes.eventItemTitle}>{occurrence.title}</EventItemTitle>
            </LinesClamp>
            {isRecurring && <EventItemRecurringIcon className={classes.eventItemRecurringIcon} aria-hidden="true" fontSize="small" />}
          </React.Fragment>
        );
      case 'regular':
        return (
          <React.Fragment>
            <ResourceLegendColor
              className={classes.resourceLegendColor}
              role="img"
              aria-label={
                resource?.title
                  ? translations.resourceAriaLabel(resource.title)
                  : translations.noResourceAriaLabel
              }
            />
            <LinesClamp style={{ '--number-of-lines': 1 } as React.CSSProperties}>
              <EventItemCardContent className={classes.eventItemCardContent}>
                <MultiDayDateLabel occurrence={occurrence} formatTime={formatTime} />
                <EventItemTitle className={classes.eventItemTitle}>{occurrence.title}</EventItemTitle>
              </EventItemCardContent>
            </LinesClamp>
            {isRecurring && <EventItemRecurringIcon className={classes.eventItemRecurringIcon} aria-hidden="true" fontSize="small" />}
          </React.Fragment>
        );
      default:
        throw new Error('Unsupported variant provided to EventItem component.');
    }
  }, [variant, resource?.title, translations, formatTime, occurrence, isRecurring, classes]);

  return (
    // TODO: Use button
    <EventItemCard
      ref={forwardedRef}
      id={id}
      className={clsx(classes.eventItemCard, occurrence.className)}
      data-variant={variant}
      data-palette={color}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
      {...other}
    >
      <EventItemCardWrapper className={classes.eventItemCardWrapper} data-variant={variant}>{content}</EventItemCardWrapper>
    </EventItemCard>
  );
});

function MultiDayDateLabel(props: {
  occurrence: SchedulerEventOccurrence;
  formatTime: ReturnType<typeof useFormatTime>;
}) {
  const { occurrence, formatTime } = props;

  const adapter = useAdapter();
  const translations = useTranslations();
  const classes = useEventCalendarClasses();

  if (
    !adapter.isSameDay(occurrence.displayTimezone.start.value, occurrence.displayTimezone.end.value)
  ) {
    const format = `${adapter.formats.dayOfMonth} ${adapter.formats.month3Letters}`;
    return (
      <EventItemTime className={classes.eventItemTime} as="span">
        {translations.eventItemMultiDayLabel(
          adapter.formatByString(occurrence.displayTimezone.end.value, format),
        )}
      </EventItemTime>
    );
  }
  if (occurrence.allDay) {
    return <EventItemTime className={classes.eventItemTime} as="span">{translations.allDay}</EventItemTime>;
  }
  return (
    <EventItemTime className={classes.eventItemTime}>
      <span>{formatTime(occurrence.displayTimezone.start.value)}</span>
      <span> - {formatTime(occurrence.displayTimezone.end.value)}</span>
    </EventItemTime>
  );
}
