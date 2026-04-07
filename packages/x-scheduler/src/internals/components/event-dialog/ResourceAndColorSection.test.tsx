import * as React from 'react';
import { screen, act } from '@mui/internal-test-utils';
import { createSchedulerRenderer, EventBuilder, ResourceBuilder } from 'test/utils/scheduler';
import { SchedulerEvent } from '@mui/x-scheduler/models';
import { EventDialogContent } from './EventDialog';
import { EventCalendarProvider } from '../EventCalendarProvider';

const resource = ResourceBuilder.new().title('Work').eventColor('blue').build();

const EVENT: SchedulerEvent = EventBuilder.new()
  .title('Test')
  .singleDay('2025-05-26T07:30:00Z', 45)
  .resource(resource)
  .color('pink')
  .build();

describe('Tab order in event dialog', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
    anchorRef: { current: anchor },
    occurrence: EventBuilder.new()
      .id(EVENT.id)
      .title(EVENT.title)
      .span(EVENT.start, EVENT.end)
      .resource(resource)
      .color('pink')
      .toOccurrence(),
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should tab from color to description and back', async () => {
    vi.spyOn(console, 'error').mockImplementation(() => {});

    const { user } = render(
      <EventCalendarProvider events={[EVENT]} resources={[resource]}>
        <EventDialogContent open {...defaultProps} />
      </EventCalendarProvider>,
    );

    const pinkButton = screen.getByRole('button', { name: /pink/i });
    const description = screen.getByRole('textbox', { name: /description/i });

    // Focus pink color button and Tab to description
    await act(() => pinkButton.focus());
    expect(document.activeElement).to.equal(pinkButton);

    await user.tab();
    console.log('After Tab from pink:', document.activeElement?.tagName, document.activeElement?.getAttribute('aria-label') || document.activeElement?.getAttribute('name'));
    expect(document.activeElement).to.equal(description);

    // Shift+Tab from description back to pink
    await user.tab({ shift: true });
    console.log('After Shift+Tab from description:', document.activeElement?.tagName, document.activeElement?.getAttribute('aria-label') || document.activeElement?.getAttribute('name'));
    expect(document.activeElement).to.equal(pinkButton);

    // Arrow to purple, then Tab should go to description
    await user.keyboard('{ArrowRight}');
    const purpleButton = screen.getByRole('button', { name: /purple/i });
    console.log('After ArrowRight, focused:', document.activeElement?.getAttribute('aria-label'));
    expect(document.activeElement).to.equal(purpleButton);

    await user.tab();
    console.log('After Tab from purple:', document.activeElement?.tagName, document.activeElement?.getAttribute('aria-label') || document.activeElement?.getAttribute('name'));
    expect(document.activeElement).to.equal(description);

    // Shift+Tab from description back to purple (last focused in group)
    await user.tab({ shift: true });
    console.log('After Shift+Tab from description:', document.activeElement?.getAttribute('aria-label'));
    expect(document.activeElement).to.equal(purpleButton);

    vi.restoreAllMocks();
  });
});
