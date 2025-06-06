'use client';
import * as React from 'react';
import clsx from 'clsx';
import { TimeGrid } from '../../primitives/time-grid';
import { useAdapter } from '../../primitives/utils/adapter/useAdapter';
import { EventProps } from './Event.types';
import './Event.css';

export const Event = React.forwardRef(function Event(
  props: EventProps,
  forwardedRef: React.ForwardedRef<HTMLDivElement>,
) {
  const { event, ariaLabelledBy, variant, className, style, ...other } = props;

  const adapter = useAdapter();
  const [titleLines, setTitleLines] = React.useState(2);
  const containerRef = React.useRef<HTMLDivElement>(null);
  const titleRef = React.useRef<HTMLParagraphElement>(null);

  const renderContent = React.useMemo(() => {
    switch (variant) {
      case 'regular':
        return (
          <React.Fragment>
            <p
              ref={titleRef}
              className={clsx('EventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': titleLines } as React.CSSProperties}
            >
              {event.title}
            </p>
            <time
              className={clsx('EventTime', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {adapter.formatByString(event.start, 'h:mm a')} -{' '}
              {adapter.formatByString(event.end, 'h:mm a')}
            </time>
          </React.Fragment>
        );
      case 'compact':
        return (
          <React.Fragment>
            <time className={clsx('EventTime')}>
              {adapter.formatByString(event.start, 'h:mm a')}
            </time>
            <p
              ref={titleRef}
              className={clsx('EventTitle', 'LinesClamp')}
              style={{ '--number-of-lines': 1 } as React.CSSProperties}
            >
              {event.title}
            </p>
          </React.Fragment>
        );
      case 'allDay':
        return (
          <p
            ref={titleRef}
            className={clsx('EventTitle', 'LinesClamp')}
            style={{ '--number-of-lines': 1 } as React.CSSProperties}
          >
            {event.title}
          </p>
        );
    }
  }, [variant]);

  React.useEffect(() => {
    if (!containerRef.current || !titleRef.current) return;

    const measure = () => {
      const containerHeight = containerRef.current!.clientHeight;
      const titleLineHeight = parseFloat(getComputedStyle(titleRef.current!).lineHeight);
      setTitleLines((prev) => {
        const newLines = containerHeight >= titleLineHeight * 3 ? 2 : 1;
        return prev === newLines ? prev : newLines;
      });
    };

    measure();

    const observer = new window.ResizeObserver(measure);
    observer.observe(containerRef.current);

    return () => observer.disconnect();
  }, [event.title, event.start, event.end, variant]);

  return (
    <div ref={forwardedRef} className={clsx('EventContainer', className)} {...other}>
      <TimeGrid.Event
        className={clsx('EventCard', `EventCard--${variant}`)}
        start={event.start}
        end={event.end}
        aria-labelledby={ariaLabelledBy}
        ref={containerRef}
      >
        {renderContent}
      </TimeGrid.Event>
    </div>
  );
});
