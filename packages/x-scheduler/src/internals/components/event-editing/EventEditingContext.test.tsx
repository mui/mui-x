import * as React from 'react';
import { createSchedulerRenderer, EventBuilder } from 'test/utils/scheduler';
import { screen } from '@mui/internal-test-utils';
import { EventCalendarProvider } from '../EventCalendarProvider';
import { EventDialogProvider } from '../event-dialog';
import { EventEditingProvider, EventEditingTrigger, useEventEditingContext } from './index';

const eventBuilder = EventBuilder.new().title('Running').singleDay('2025-05-26T07:30:00Z', 45);

const event = eventBuilder.build();
const occurrence = eventBuilder.toOccurrence();

describe('<EventEditingProvider />', () => {
  const { render } = createSchedulerRenderer();

  /**
   * Renders the same occurrence behind several triggers, each unmountable on its own. Every anchor
   * the provider publishes is recorded so tests can assert the intermediate values too.
   */
  function renderTriggers(triggerIds: string[], { withDialog = false } = {}) {
    const anchors: (string | null)[] = [];

    function AnchorRecorder() {
      const { anchor } = useEventEditingContext();
      React.useEffect(() => {
        anchors.push(anchor === null ? null : anchor.dataset.testid!);
      }, [anchor]);
      return null;
    }

    // EventDialogProvider renders its own EventEditingProvider with the dialog surface.
    const Provider = withDialog
      ? EventDialogProvider
      : ({ children }: { children: React.ReactNode }) => (
          <EventEditingProvider surface="dialog">{children}</EventEditingProvider>
        );

    function Harness() {
      const [mounted, setMounted] = React.useState(triggerIds);

      return (
        <EventCalendarProvider events={[event]} resources={[]}>
          <Provider>
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
          </Provider>
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

  it('should keep the dialog and its draft when the trigger it was opened from unmounts', async () => {
    const { user } = renderTriggers(['cell', 'popover'], { withDialog: true });

    await user.click(screen.getByTestId('popover'));
    const titleInput = await screen.findByLabelText<HTMLInputElement>(/event title/i);
    await user.type(titleInput, ' draft');

    await user.click(screen.getByTestId('unmount-popover'));

    // A remount would reseed the form from the event, discarding the typed draft.
    expect(screen.getByRole('dialog')).not.to.equal(null);
    expect(screen.getByLabelText<HTMLInputElement>(/event title/i).value).to.equal('Running draft');
  });

  it('should clear the anchor once no trigger is left to hold it', async () => {
    const { user, currentAnchor } = renderTriggers(['cell', 'popover']);

    await user.click(screen.getByTestId('popover'));
    await user.click(screen.getByTestId('unmount-popover'));
    await user.click(screen.getByTestId('unmount-cell'));

    expect(currentAnchor()).to.equal(null);
  });
});
