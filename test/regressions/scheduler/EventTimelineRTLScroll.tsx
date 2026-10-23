import * as React from 'react';
import { prefixer } from 'stylis';
import rtlPlugin from '@mui/stylis-plugin-rtl';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventTimelinePremium } from '@mui/x-scheduler-premium/event-timeline-premium';

const cacheRtl = createCache({
  key: 'event-timeline-rtl-scroll',
  stylisPlugins: [prefixer, rtlPlugin],
});

const resources = [
  { id: 'design', title: 'Design team with a long title', eventColor: 'purple' as const },
  { id: 'engineering', title: 'Engineering', eventColor: 'teal' as const },
];

const visibleDate = new Date('2025-07-03T00:00:00');

const events = [
  {
    id: 'kickoff',
    title: 'Kickoff',
    start: '2025-07-03T09:00:00',
    end: '2025-07-03T12:00:00',
    resource: 'design',
  },
  {
    id: 'release',
    title: 'Release',
    start: '2025-07-06T10:00:00',
    end: '2025-07-06T16:00:00',
    resource: 'engineering',
  },
];

const theme = createTheme({ direction: 'rtl' });

// Scrolled to the inline end, both the rows and the title column, so the pinned title
// column, the scrollbars and the virtualized columns are captured in their RTL positions.
export default function EventTimelineRTLScroll() {
  const containerRef = React.useRef<HTMLDivElement>(null);
  const [isScrolled, setIsScrolled] = React.useState(false);

  // The timeline measures its columns and its title column after mounting, and only
  // renders the title scrollbar once the titles overflow, so the scroll is applied again
  // each time it changes. The observers aren't faked by the regression clock, so the
  // pending marker clears before the timers run.
  React.useEffect(() => {
    const container = containerRef.current!;
    const scroller = container.querySelector<HTMLElement>('[role="grid"]')!;
    const root = scroller.closest('section')!;
    const checkScrolled = () => {
      // Its sign depends on the version, only whether it moved matters.
      const titleScroll = parseFloat(root.style.getPropertyValue('--title-scroll-left'));
      if (scroller.scrollLeft < 0 && Math.abs(titleScroll) > 0) {
        setIsScrolled(true);
      }
    };
    const scrollToEnd = () => {
      // In RTL, `scrollLeft` goes from 0 down to negative values.
      scroller.scrollLeft = -scroller.scrollWidth;
      // A horizontal wheel over a title cell scrolls the title column, like a user does.
      container
        .querySelector('.MuiEventTimeline-titleCell')
        ?.dispatchEvent(
          new WheelEvent('wheel', { deltaX: -1000, bubbles: true, cancelable: true }),
        );
      checkScrolled();
    };
    const resizeObserver = new ResizeObserver(scrollToEnd);
    resizeObserver.observe(scroller);
    Array.from(scroller.children).forEach((child) => resizeObserver.observe(child));
    // Also catches the title column offset, written as a style variable on the root.
    const mutationObserver = new MutationObserver(scrollToEnd);
    mutationObserver.observe(root, { attributeFilter: ['style'], childList: true, subtree: true });
    return () => {
      resizeObserver.disconnect();
      mutationObserver.disconnect();
    };
  }, []);

  return (
    <CacheProvider value={cacheRtl}>
      <ThemeProvider theme={theme}>
        <div ref={containerRef} dir="rtl" style={{ height: 400, width: 800 }}>
          {!isScrolled && <span data-screenshot-pending hidden />}
          <EventTimelinePremium
            events={events}
            resources={resources}
            visibleDate={visibleDate}
            preset="dayAndHour"
          />
        </div>
      </ThemeProvider>
    </CacheProvider>
  );
}
