import * as React from 'react';
import clsx from 'clsx';
import { useStore } from '@base-ui-components/utils/store';
import { useId } from '@base-ui-components/utils/useId';
import { Timeline } from '@mui/x-scheduler-headless/timeline';
import { selectors } from '@mui/x-scheduler-headless/use-timeline';
import { useTimelineStoreContext } from '@mui/x-scheduler-headless/use-timeline-store-context';
import { getColorClassName } from '../../../../internals/utils/color-utils';
import { TimelineEventProps } from './TimelineEvent.types';

import './TimelineEvent.css';

export const TimelineEvent = React.forwardRef(function TimelineEvent(
  props: TimelineEventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const {
    occurrence,
    ariaLabelledBy,
    className,
    onEventClick,
    id: idProp,
    style,
    ...other
  } = props;

  const store = useTimelineStoreContext();

  const id = useId(idProp);
  const color = useStore(store, selectors.eventColor, occurrence.id);

  return (
    <Timeline.Event
      ref={forwardedRef}
      className={clsx(className, 'TimelineEvent', 'LinesClamp', getColorClassName(color))}
      id={id}
      aria-labelledby={`${ariaLabelledBy} ${id}`}
      style={
        {
          '--number-of-lines': 1,
          '--row-index': occurrence.position.firstIndex,
        } as React.CSSProperties
      }
      start={occurrence.start}
      end={occurrence.end}
      {...other}
    >
      {occurrence.title}
    </Timeline.Event>
  );
});
