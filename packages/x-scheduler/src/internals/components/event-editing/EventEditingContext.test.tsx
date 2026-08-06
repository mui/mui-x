import * as React from 'react';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import type { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventCalendarProvider } from '../EventCalendarProvider';
import { EventEditingProvider, EventEditingTrigger, useEventEditingContext } from './index';

const EVENT: SchedulerEvent = EventBuilder.new()
  .title('Running')
  .singleDay('2025-05-26T07:30:00Z', 45)
  .build();

const occurrence = EventBuilder.new()
  .id(EVENT.id)
  .title(EVENT.title)
  .span(EVENT.start, EVENT.end)
  .toOccurrence();

function AnchorProbe({ onAnchor }: { onAnchor: (anchor: HTMLElement | null) => void }) {
  const { anchor } = useEventEditingContext();
  React.useEffect(() => {
    onAnchor(anchor);
  }, [anchor, onAnchor]);
  return null;
}

describe('<EventEditingProvider />', () => {
  const { render } = createSchedulerRenderer();

  // The same occurrence is rendered by two triggers whenever the "+N more" popover is open: one in
  // the month cell, one in the popover. Both anchor the editing surface, so the one that unmounts
  // first must not clear an anchor that the other one now owns.
  it('should keep the anchor when a trigger unmounts after a sibling re-anchored the same occurrence', async () => {
    let currentAnchor: HTMLElement | null = null;
    const handleAnchor = (anchor: HTMLElement | null) => {
      currentAnchor = anchor;
    };

    function Harness() {
      const [cellMounted, setCellMounted] = React.useState(true);

      return (
        <EventCalendarProvider events={[EVENT]} resources={[]}>
          <EventEditingProvider surface="dialog">
            <AnchorProbe onAnchor={handleAnchor} />
            {cellMounted && (
              <EventEditingTrigger occurrence={occurrence}>
                <button type="button" data-testid="cell-trigger">
                  cell
                </button>
              </EventEditingTrigger>
            )}
            <EventEditingTrigger occurrence={occurrence}>
              <button type="button" data-testid="popover-trigger">
                popover
              </button>
            </EventEditingTrigger>
            <button type="button" data-testid="unmount-cell" onClick={() => setCellMounted(false)}>
              unmount cell
            </button>
          </EventEditingProvider>
        </EventCalendarProvider>
      );
    }

    const { user } = render(<Harness />);

    await user.click(screen.getByTestId('cell-trigger'));
    // Both triggers anchor on mount, in tree order, so the last one rendered owns the anchor.
    expect(currentAnchor).to.equal(screen.getByTestId('popover-trigger'));

    await user.click(screen.getByTestId('unmount-cell'));

    expect(currentAnchor).to.equal(screen.getByTestId('popover-trigger'));
  });

  it('should hand the anchor to a surviving trigger when the one owning it unmounts', async () => {
    let currentAnchor: HTMLElement | null = null;
    const handleAnchor = (anchor: HTMLElement | null) => {
      currentAnchor = anchor;
    };

    function Harness() {
      const [popoverMounted, setPopoverMounted] = React.useState(true);

      return (
        <EventCalendarProvider events={[EVENT]} resources={[]}>
          <EventEditingProvider surface="dialog">
            <AnchorProbe onAnchor={handleAnchor} />
            <EventEditingTrigger occurrence={occurrence}>
              <button type="button" data-testid="cell-trigger">
                cell
              </button>
            </EventEditingTrigger>
            {popoverMounted && (
              <EventEditingTrigger occurrence={occurrence}>
                <button type="button" data-testid="popover-trigger">
                  popover
                </button>
              </EventEditingTrigger>
            )}
            <button
              type="button"
              data-testid="unmount-popover"
              onClick={() => setPopoverMounted(false)}
            >
              unmount popover
            </button>
          </EventEditingProvider>
        </EventCalendarProvider>
      );
    }

    const { user } = render(<Harness />);

    await user.click(screen.getByTestId('cell-trigger'));
    const popoverTrigger = screen.getByTestId('popover-trigger');
    expect(currentAnchor).to.equal(popoverTrigger);

    // The owner goes away, so the surface would otherwise be left with no anchor at all.
    await user.click(screen.getByTestId('unmount-popover'));

    expect(currentAnchor).to.equal(screen.getByTestId('cell-trigger'));
  });
});
