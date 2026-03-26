'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled, useThemeProps } from '@mui/material/styles';
import { StandaloneEvent as HeadlessStandaloneEvent } from '@mui/x-scheduler-headless/standalone-event';
import { StandaloneEventProps } from './StandaloneEvent.types';
import { EventDragPreview } from '../internals/components/event-drag-preview';
import { EventCalendarStyledContext } from '../event-calendar/EventCalendarStyledContext';

const StandaloneEventRoot = styled(HeadlessStandaloneEvent, {
  name: 'MuiEventCalendar',
  slot: 'StandaloneEvent',
})({});

const StandaloneEvent = React.forwardRef<HTMLDivElement, StandaloneEventProps>(
  function StandaloneEvent(inProps, forwardedRef) {
    const props = useThemeProps({ props: inProps, name: 'MuiEventCalendar' });
    const styledContext = React.useContext(EventCalendarStyledContext);
    return (
      <StandaloneEventRoot
        ref={forwardedRef}
        className={styledContext?.classes.standaloneEvent}
        {...props}
        renderDragPreview={(parameters) => <EventDragPreview {...parameters} />}
      />
    );
  },
);

StandaloneEvent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * CSS class applied to the element, or a function that
   * returns a class based on the component’s state.
   */
  className: PropTypes.oneOfType([PropTypes.func, PropTypes.string]),
  data: PropTypes.oneOfType([
    PropTypes.shape({
      allDay: PropTypes.bool,
      className: PropTypes.string,
      displayTimezone: PropTypes.shape({
        end: PropTypes.shape({
          key: PropTypes.string.isRequired,
          minutesInDay: PropTypes.number.isRequired,
          timestamp: PropTypes.number.isRequired,
          value: PropTypes.instanceOf(Date).isRequired,
        }).isRequired,
        exDates: PropTypes.arrayOf(PropTypes.instanceOf(Date)),
        rrule: PropTypes.shape({
          byDay: PropTypes.arrayOf(
            PropTypes.oneOf([
              '-1FR',
              '-1MO',
              '-1SA',
              '-1SU',
              '-1TH',
              '-1TU',
              '-1WE',
              '-2FR',
              '-2MO',
              '-2SA',
              '-2SU',
              '-2TH',
              '-2TU',
              '-2WE',
              '-3FR',
              '-3MO',
              '-3SA',
              '-3SU',
              '-3TH',
              '-3TU',
              '-3WE',
              '-4FR',
              '-4MO',
              '-4SA',
              '-4SU',
              '-4TH',
              '-4TU',
              '-4WE',
              '-5FR',
              '-5MO',
              '-5SA',
              '-5SU',
              '-5TH',
              '-5TU',
              '-5WE',
              '1FR',
              '1MO',
              '1SA',
              '1SU',
              '1TH',
              '1TU',
              '1WE',
              '2FR',
              '2MO',
              '2SA',
              '2SU',
              '2TH',
              '2TU',
              '2WE',
              '3FR',
              '3MO',
              '3SA',
              '3SU',
              '3TH',
              '3TU',
              '3WE',
              '4FR',
              '4MO',
              '4SA',
              '4SU',
              '4TH',
              '4TU',
              '4WE',
              '5FR',
              '5MO',
              '5SA',
              '5SU',
              '5TH',
              '5TU',
              '5WE',
              'FR',
              'MO',
              'SA',
              'SU',
              'TH',
              'TU',
              'WE',
            ]).isRequired,
          ),
          byMonth: PropTypes.arrayOf(PropTypes.number),
          byMonthDay: PropTypes.arrayOf(PropTypes.number),
          count: PropTypes.number,
          freq: PropTypes.oneOf(['DAILY', 'MONTHLY', 'WEEKLY', 'YEARLY']).isRequired,
          interval: PropTypes.number,
          until: PropTypes.instanceOf(Date),
        }),
        start: PropTypes.shape({
          key: PropTypes.string.isRequired,
          minutesInDay: PropTypes.number.isRequired,
          timestamp: PropTypes.number.isRequired,
          value: PropTypes.instanceOf(Date).isRequired,
        }).isRequired,
        timezone: PropTypes.string.isRequired,
      }).isRequired,
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      resource: PropTypes.string,
      title: PropTypes.string.isRequired,
    }),
    PropTypes.shape({
      allDay: PropTypes.bool,
      className: PropTypes.string,
      color: PropTypes.oneOf([
        'amber',
        'blue',
        'green',
        'grey',
        'indigo',
        'lime',
        'orange',
        'pink',
        'purple',
        'red',
        'teal',
      ]),
      description: PropTypes.string,
      draggable: PropTypes.bool,
      duration: PropTypes.number,
      exDates: PropTypes.arrayOf(PropTypes.string),
      extractedFromId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
      id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
      readOnly: PropTypes.bool,
      resizable: PropTypes.oneOfType([PropTypes.oneOf(['end', 'start']), PropTypes.bool]),
      resource: PropTypes.string,
      rrule: PropTypes.oneOfType([
        PropTypes.shape({
          byDay: PropTypes.arrayOf(
            PropTypes.oneOf([
              '-1FR',
              '-1MO',
              '-1SA',
              '-1SU',
              '-1TH',
              '-1TU',
              '-1WE',
              '-2FR',
              '-2MO',
              '-2SA',
              '-2SU',
              '-2TH',
              '-2TU',
              '-2WE',
              '-3FR',
              '-3MO',
              '-3SA',
              '-3SU',
              '-3TH',
              '-3TU',
              '-3WE',
              '-4FR',
              '-4MO',
              '-4SA',
              '-4SU',
              '-4TH',
              '-4TU',
              '-4WE',
              '-5FR',
              '-5MO',
              '-5SA',
              '-5SU',
              '-5TH',
              '-5TU',
              '-5WE',
              '1FR',
              '1MO',
              '1SA',
              '1SU',
              '1TH',
              '1TU',
              '1WE',
              '2FR',
              '2MO',
              '2SA',
              '2SU',
              '2TH',
              '2TU',
              '2WE',
              '3FR',
              '3MO',
              '3SA',
              '3SU',
              '3TH',
              '3TU',
              '3WE',
              '4FR',
              '4MO',
              '4SA',
              '4SU',
              '4TH',
              '4TU',
              '4WE',
              '5FR',
              '5MO',
              '5SA',
              '5SU',
              '5TH',
              '5TU',
              '5WE',
              'FR',
              'MO',
              'SA',
              'SU',
              'TH',
              'TU',
              'WE',
            ]).isRequired,
          ),
          byMonth: PropTypes.arrayOf(PropTypes.number),
          byMonthDay: PropTypes.arrayOf(PropTypes.number),
          count: PropTypes.number,
          freq: PropTypes.oneOf(['DAILY', 'MONTHLY', 'WEEKLY', 'YEARLY']).isRequired,
          interval: PropTypes.number,
          until: PropTypes.string,
        }),
        PropTypes.string,
      ]),
      timezone: PropTypes.string,
      title: PropTypes.string.isRequired,
    }),
  ]).isRequired,
  /**
   * Whether the component renders a native `<button>` element when replacing it
   * via the `render` prop.
   * Set to `true` if the rendered element is a native button.
   * @default false
   */
  nativeButton: PropTypes.bool,
  /**
   * Callback fired when the event is dropped into the Event Calendar.
   */
  onEventDrop: PropTypes.func,
  /**
   * Allows you to replace the component’s HTML element
   * with a different tag, or compose it with another component.
   *
   * Accepts a `ReactElement` or a function that returns the element to render.
   */
  render: PropTypes.oneOfType([PropTypes.element, PropTypes.func]),
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { StandaloneEvent };
