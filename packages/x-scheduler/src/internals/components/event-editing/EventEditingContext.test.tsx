import * as React from 'react';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { EventCalendarProvider } from '../EventCalendarProvider';
import { EventEditingProvider, EventEditingTrigger, useEventEditingContext } from './index';

const eventBuilder = EventBuilder.new().title('Running').singleDay('2025-05-26T07:30:00Z', 45);

const event = eventBuilder.build();
const occurrence = eventBuilder.toOccurrence();

describe('<EventEditingProvider />', () => {
  const { render } = createSchedulerRenderer();

  /**
   * Stands in for the same event being on screen more than once — in a month cell and in the
   * "+N more" popover, or on each day a multi-day event spans. Every copy can be unmounted on its
   * own, so a test can pick which one goes away, and every anchor the provider publishes is
   * recorded, so it can assert what the anchor went through and not only where it ended up.
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
        <EventCalendarProvider events={[event]} resources={[]}>
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
