'use client';
import * as React from 'react';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { createSelector, useStore } from '@base-ui/utils/store';
import RepeatRounded from '@mui/icons-material/RepeatRounded';
import { CalendarGrid } from '@mui/x-scheduler-headless/calendar-grid';
import {
  SchedulerEventSide,
  SchedulerRenderableEventOccurrence,
} from '@mui/x-scheduler-headless/models';
import { EventCalendarState } from '@mui/x-scheduler-headless/use-event-calendar';
import {
  schedulerEventSelectors,
  schedulerResourceSelectors,
} from '@mui/x-scheduler-headless/scheduler-selectors';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-headless/use-event-calendar-store-context';
import { eventCalendarViewSelectors } from '@mui/x-scheduler-headless/event-calendar-selectors';
import { DayGridEventProps } from './DayGridEvent.types';
import { isOccurrenceAllDayOrMultipleDay } from '../../../utils/event-utils';
import { useTranslations } from '../../../utils/TranslationsContext';
import { EventDragPreview } from '../../../../components/event-drag-preview';
import { useFormatTime } from '../../../../hooks/useFormatTime';
import { schedulerPaletteStyles } from '../../../utils/tokens';

const DayGridEventBaseStyles = (theme: any) => ({
  containerType: 'inline-size',
  borderRadius: theme.shape.borderRadius * 0.75,
  backgroundColor: 'var(--event-color-3)',
  minWidth: 18,
  height: 'auto',
  cursor: 'pointer',
  position: 'relative',
  zIndex: 1,
  gridRow: 'var(--grid-row)',
  gridColumn: 1,
  padding: `0 ${theme.spacing(0.5)}`,
  width: `calc(var(--grid-column-span) * 100% + (var(--grid-column-span) - 1) * 2 * ${theme.spacing(0.5)} + (var(--grid-column-span) - 1) * 1px)`,
  '&[data-dragging], &[data-resizing]': {
    opacity: 0.5,
  },
  ...schedulerPaletteStyles,
});

const DayGridEventRoot = styled(CalendarGrid.DayEvent, {
  name: 'MuiEventCalendar',
  slot: 'DayGridEvent',
})<{ 'data-variant'?: 'filled' | 'invisible' | 'compact' | 'placeholder' }>(({ theme }) => ({
  ...(DayGridEventBaseStyles(theme) as any),
  '&[data-variant="invisible"]': {
    width: '100%',
    visibility: 'hidden',
    height: 18,
  },
  '&[data-variant="compact"]': {
    height: 'fit-content',
    '&:active': {
      backgroundColor: 'var(--interactive-active-bg)',
    },
    '&:hover': {
      backgroundColor: 'var(--interactive-hover-bg)',
    },
  },
}));

const DayGridEventPlaceholder = styled(CalendarGrid.DayEventPlaceholder, {
  name: 'MuiEventCalendar',
  slot: 'DayGridEventPlaceholder',
})(({ theme }) => ({
  ...(DayGridEventBaseStyles(theme) as any),
  zIndex: 2,
}));

const DayGridEventTitle = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'DayGridEventTitle',
})(({ theme }) => ({
  margin: 0,
  color: 'var(--event-color-12)',
  fontWeight: theme.typography.fontWeightMedium,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
}));

const DayGridEventTime = styled('time', {
  name: 'MuiEventCalendar',
  slot: 'DayGridEventTime',
})(({ theme }) => ({
  display: 'inline-block',
  color: 'var(--event-color-11)',
  fontWeight: theme.typography.fontWeightRegular,
  fontSize: theme.typography.caption.fontSize,
  lineHeight: 1.43,
  whiteSpace: 'nowrap',
  width: 150,
  '@container (width < 300px)': {
    display: 'inline',
    '& > span:last-of-type': {
      display: 'none',
    },
  },
}));

const DayGridEventRecurringIcon = styled(RepeatRounded, {
  name: 'MuiEventCalendar',
  slot: 'DayGridEventRecurringIcon',
})({
  position: 'absolute',
  bottom: 1,
  right: 3,
  color: 'var(--event-color-11)',
});

const DayGridEventResizeHandler = styled(CalendarGrid.DayEventResizeHandler, {
  name: 'MuiEventCalendar',
  slot: 'DayGridEventResizeHandler',
})({
  position: 'absolute',
  width: 4,
  top: 0,
  bottom: 0,
  zIndex: 3,
  cursor: 'ew-resize',
  opacity: 0,
  '*:hover > &': {
    opacity: 1,
  },
  '&[data-start]': {
    left: 0,
  },
  '&[data-end]': {
    right: 0,
  },
});

const DayGridEventCardWrapper = styled('div', {
  name: 'MuiEventCalendar',
  slot: 'DayGridEventCardWrapper',
})(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  gap: theme.spacing(1),
  paddingInline: theme.spacing(1),
  '@container (width < 300px)': {
    padding: `0 0 0 ${theme.spacing(0.5)}`,
    gap: theme.spacing(0.5),
    [`& ${DayGridEventTitle}`]: {
      marginInlineStart: theme.spacing(0.5),
      paddingInlineEnd: theme.spacing(1.5),
    },
  },
}));

const DayGridEventCardContent = styled('p', {
  name: 'MuiEventCalendar',
  slot: 'DayGridEventCardContent',
})({
  margin: 0,
  height: 20,
  lineHeight: '20px',
});

const EventColorIndicator = styled('span', {
  name: 'MuiEventCalendar',
  slot: 'EventColorIndicator',
})({
  width: 8,
  height: 8,
  borderRadius: '50%',
  flexShrink: 0,
  backgroundColor: 'var(--event-color-9)',
  marginTop: 2,
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

const isResizableSelector = createSelector(
  (
    state: EventCalendarState,
    side: SchedulerEventSide,
    occurrence: SchedulerRenderableEventOccurrence,
  ) => {
    if (!schedulerEventSelectors.isResizable(state, occurrence.id, side)) {
      return false;
    }

    const view = eventCalendarViewSelectors.view(state);

    // There is only one day cell in the day view
    if (view === 'day') {
      return false;
    }

    // In month view, only multi-day and all-day events can be resized
    if (view === 'month') {
      return isOccurrenceAllDayOrMultipleDay(occurrence, state.adapter);
    }

    return true;
  },
);

export const DayGridEvent = React.forwardRef(function DayGridEvent(
  props: DayGridEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { occurrence, variant, style: styleProp, ...other } = props;

  // Context hooks
  const translations = useTranslations();
  const store = useEventCalendarStoreContext();

  // Selector hooks
  const isDraggable = useStore(store, schedulerEventSelectors.isDraggable, occurrence.id);
  const isStartResizable = useStore(store, isResizableSelector, 'start', occurrence);
  const isEndResizable = useStore(store, isResizableSelector, 'end', occurrence);
  const isRecurring = useStore(store, schedulerEventSelectors.isRecurring, occurrence.id);

  const resource = useStore(
    store,
    schedulerResourceSelectors.processedResource,
    occurrence.resource,
  );
  const color = useStore(store, schedulerEventSelectors.color, occurrence.id);

  // Feature hooks
  const formatTime = useFormatTime();

  const content = React.useMemo(() => {
    switch (variant) {
      case 'invisible': {
        return null;
      }
      case 'filled':
      case 'placeholder':
        return (
          <React.Fragment>
            <LinesClamp style={{ '--number-of-lines': 1 } as React.CSSProperties}>
              <DayGridEventTitle>{occurrence.title}</DayGridEventTitle>
            </LinesClamp>
            {isRecurring && <DayGridEventRecurringIcon aria-hidden="true" fontSize="small" />}
          </React.Fragment>
        );

      case 'compact':
        return (
          <DayGridEventCardWrapper>
            <EventColorIndicator
              role="img"
              aria-label={
                resource?.title
                  ? translations.resourceAriaLabel(resource.title)
                  : translations.noResourceAriaLabel
              }
            />
            <LinesClamp style={{ '--number-of-lines': 1 } as React.CSSProperties}>
              <DayGridEventCardContent>
                <DayGridEventTime>
                  <span>{formatTime(occurrence.displayTimezone.start.value)}</span>
                  <span> - {formatTime(occurrence.displayTimezone.end.value)}</span>
                </DayGridEventTime>
                <DayGridEventTitle as="span">{occurrence.title}</DayGridEventTitle>
              </DayGridEventCardContent>
            </LinesClamp>
            {isRecurring && <DayGridEventRecurringIcon aria-hidden="true" fontSize="small" />}
          </DayGridEventCardWrapper>
        );
      default:
        throw new Error('Unsupported variant provided to EventItem component.');
    }
  }, [
    variant,
    occurrence.title,
    occurrence.displayTimezone.start.value,
    occurrence.displayTimezone.end.value,
    isRecurring,
    resource?.title,
    translations,
    formatTime,
  ]);

  const sharedProps = {
    start: occurrence.displayTimezone.start,
    end: occurrence.displayTimezone.end,
    ref: forwardedRef,
    className: clsx('EventContainer', occurrence.className),
    'data-variant': variant,
    'data-palette': color,
    style: {
      '--grid-row': occurrence.position.index,
      '--grid-column-span': occurrence.position.daySpan,
      ...styleProp,
    } as React.CSSProperties,
    ...other,
  };

  if (variant === 'placeholder') {
    return (
      <DayGridEventPlaceholder aria-hidden={true} {...sharedProps}>
        {content}
      </DayGridEventPlaceholder>
    );
  }

  return (
    <DayGridEventRoot
      eventId={occurrence.id}
      occurrenceKey={occurrence.key}
      isDraggable={isDraggable}
      renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      aria-hidden={variant === 'invisible'}
      {...sharedProps}
    >
      {isStartResizable && <DayGridEventResizeHandler side="start" />}
      {content}
      {isEndResizable && <DayGridEventResizeHandler side="end" />}
    </DayGridEventRoot>
  );
});
