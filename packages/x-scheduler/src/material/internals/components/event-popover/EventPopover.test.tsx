import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { CalendarEvent } from '@mui/x-scheduler/primitives/models';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { spy } from 'sinon';
import { Popover } from '@base-ui-components/react/popover';
import { EventPopover } from './EventPopover';

const calendarEvent: CalendarEvent = {
  id: '1',
  start: DateTime.fromISO('2025-05-26T07:30:00'),
  end: DateTime.fromISO('2025-05-26T08:15:00'),
  title: 'Running',
  description: 'Morning run',
};

describe('<EventPopover />', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
    calendarEvent,
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should render the event data in the form fields', () => {
    render(
      <StandaloneView events={[calendarEvent]}>
        <Popover.Root open>
          <EventPopover {...defaultProps} />
        </Popover.Root>
      </StandaloneView>,
    );
    expect(screen.getByDisplayValue('Running')).not.to.equal(null);
    expect(screen.getByDisplayValue('Morning run')).not.to.equal(null);
    expect(screen.getByLabelText(/start date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/end date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/start time/i)).to.have.value('07:30');
    expect(screen.getByLabelText(/end time/i)).to.have.value('08:15');
    expect(screen.getByRole('checkbox', { name: /all day/i })).to.have.attribute(
      'aria-checked',
      'false',
    );
  });

  it('should call "onEventsChange" with updated values on submit', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <StandaloneView events={[calendarEvent]} onEventsChange={onEventsChange}>
        <Popover.Root open>
          <EventPopover {...defaultProps} />
        </Popover.Root>
      </StandaloneView>,
    );
    await user.type(screen.getByLabelText(/event title/i), ' test');
    await user.click(screen.getByRole('checkbox', { name: /all day/i }));
    await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
    await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];
    expect(updated.title).to.equal('Running test');
    expect(updated.rrule?.freq).to.equal('DAILY');
    expect(updated.allDay).to.equal(true);
  });

  it('should show error if start date is after end date', async () => {
    const { user } = render(
      <StandaloneView events={[calendarEvent]}>
        <Popover.Root open>
          <EventPopover {...defaultProps} />
        </Popover.Root>
      </StandaloneView>,
    );
    await user.clear(screen.getByLabelText(/start date/i));
    await user.type(screen.getByLabelText(/start date/i), '2025-05-27');
    await user.clear(screen.getByLabelText(/end date/i));
    await user.type(screen.getByLabelText(/end date/i), '2025-05-26');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(screen.getDescriptionOf(screen.getByLabelText(/start date/i)).textContent).to.match(
      /start.*before.*end/i,
    );
  });

  it('should call "onEventsChange" with the updated values when delete button is clicked', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <StandaloneView events={[calendarEvent]} onEventsChange={onEventsChange}>
        <Popover.Root open>
          <EventPopover {...defaultProps} />
        </Popover.Root>
      </StandaloneView>,
    );
    await user.click(screen.getByRole('button', { name: /delete event/i }));
    expect(onEventsChange.calledOnce).to.equal(true);
    expect(onEventsChange.firstCall.firstArg).to.deep.equal([]);
  });

  it('should handle read-only events', () => {
    render(
      <StandaloneView events={[calendarEvent]}>
        <Popover.Root open>
          <EventPopover {...defaultProps} calendarEvent={{ ...calendarEvent, readOnly: true }} />
        </Popover.Root>
      </StandaloneView>,
    );
    expect(screen.getByDisplayValue('Running')).to.have.attribute('readonly');
    expect(screen.getByDisplayValue('Morning run')).to.have.attribute('readonly');
    expect(screen.getByLabelText(/start date/i)).to.have.attribute('readonly');
    expect(screen.getByLabelText(/end date/i)).to.have.attribute('readonly');
    expect(screen.getByLabelText(/start time/i)).to.have.attribute('readonly');
    expect(screen.getByLabelText(/end time/i)).to.have.attribute('readonly');
    expect(screen.queryByRole('button', { name: /save changes/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: /delete event/i })).to.equal(null);
  });
});
