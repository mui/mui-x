import { screen, within } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';
import {
  createSchedulerRenderer,
  DEFAULT_TESTING_VISIBLE_DATE,
  EventBuilder,
  ResourceBuilder,
} from 'test/utils/scheduler';
import { describe, it, expect } from 'vitest';

describe('<EventCalendar /> - RTL', () => {
  const { renderSettled } = createSchedulerRenderer();

  it('should mirror the arrow keys of the Base UI components', async () => {
    const resource = ResourceBuilder.new().title('Resource').build();
    const event = EventBuilder.new()
      .title('Meeting')
      .resource(resource)
      .span('2025-07-03T09:00:00Z', '2025-07-03T10:00:00Z')
      .build();

    const { user } = await renderSettled(
      <ThemeProvider theme={createTheme({ direction: 'rtl' })}>
        <div dir="rtl" style={{ width: 1200, height: 600 }}>
          <EventCalendar
            events={[event]}
            resources={[resource]}
            visibleDate={DEFAULT_TESTING_VISIBLE_DATE}
          />
        </div>
      </ThemeProvider>,
    );

    await user.click(screen.getByRole('button', { name: /^Meeting,/ }));
    const dialog = await screen.findByRole('dialog');
    // The color picker is a Base UI ToggleGroup, which reads the direction from the root.
    const colorGroup = within(dialog).getByRole('group', { name: 'Event color' });
    const colors = within(colorGroup).getAllByRole('button');

    await user.click(colors[0]);
    await user.keyboard('{ArrowLeft}');

    // In LTR, ArrowLeft from the first color loops to the last one.
    expect(colors[1]).toHaveFocus();
  });
});
