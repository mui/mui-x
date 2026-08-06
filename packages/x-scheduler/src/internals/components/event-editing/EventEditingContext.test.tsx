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

describe('<EventEditingProvider />', () => {
  const { render } = createSchedulerRenderer();

  /**
   * Renders one trigger per id for the same occurrence, each removable on its own, and records
   * every anchor the context publishes.
   */
  function renderTriggers(triggerIds: string[]) {
    const anchors: (string | null)[] = [];

    function AnchorRecorder() {
      const { anchor } = useEventEditingContext();
      React.useEffect(() => {
        anchors.push(anchor === null ? null : anchor.dataset.testid!);
      }, [anchor]);
      return null;
    }

    function Harness() {
      const [mounted, setMounted] = React.useState(triggerIds);

      return (
        <EventCalendarProvider events={[EVENT]} resources={[]}>
          <EventEditingProvider surface="dialog">
            <AnchorRecorder />
            {triggerIds.map((id) =>
              mounted.includes(id) ? (
                <EventEditingTrigger key={id} occurrence={occurrence}>
                  <button type="button" data-testid={id}>
                    {id}
                  </button>
                </EventEditingTrigger>
              ) : null,
            )}
            {triggerIds.map((id) => (
              <button
                key={`unmount-${id}`}
                type="button"
                data-testid={`unmount-${id}`}
                onClick={() => setMounted((prev) => prev.filter((item) => item !== id))}
              >
                unmount {id}
              </button>
            ))}
          </EventEditingProvider>
        </EventCalendarProvider>
      );
    }

    const { user } = render(<Harness />);

    return { user, anchors, currentAnchor: () => anchors[anchors.length - 1] };
  }

  it('should keep the anchor on the trigger the user activated', async () => {
    const { user, currentAnchor } = renderTriggers(['cell', 'popover']);

    // `popover` mounts last, so an anchor decided by mount order would land there instead.
    await user.click(screen.getByTestId('cell'));

    expect(currentAnchor()).to.equal('cell');
  });

  it('should keep the anchor when another trigger for the same occurrence unmounts', async () => {
    const { user, currentAnchor } = renderTriggers(['cell', 'popover']);

    await user.click(screen.getByTestId('cell'));
    await user.click(screen.getByTestId('unmount-popover'));

    expect(currentAnchor()).to.equal('cell');
  });

  it('should hand the anchor to a surviving trigger without ever clearing it', async () => {
    const { user, anchors, currentAnchor } = renderTriggers(['cell', 'popover']);

    await user.click(screen.getByTestId('popover'));
    expect(currentAnchor()).to.equal('popover');

    const beforeUnmount = anchors.length;
    await user.click(screen.getByTestId('unmount-popover'));

    expect(currentAnchor()).to.equal('cell');
    // A `null` in between unmounts the editing surface, which reseeds the form and drops the draft.
    expect(anchors.slice(beforeUnmount)).to.not.include(null);
  });

  it('should clear the anchor once no trigger is left to hold it', async () => {
    const { user, currentAnchor } = renderTriggers(['cell', 'popover']);

    await user.click(screen.getByTestId('popover'));
    await user.click(screen.getByTestId('unmount-popover'));
    await user.click(screen.getByTestId('unmount-cell'));

    expect(currentAnchor()).to.equal(null);
  });
});
