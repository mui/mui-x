import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/primitives/models';
import { StandaloneView } from '@mui/x-scheduler/material/standalone-view';
import { spy } from 'sinon';
import { Popover } from '@base-ui-components/react/popover';
import { getAdapter } from '../../../../primitives/utils/adapter/getAdapter';
import { EventPopover } from './EventPopover';

const adapter = getAdapter();

const calendarEvent: CalendarEvent = {
  id: '1',
  start: adapter.date('2025-05-26T07:30:00'),
  end: adapter.date('2025-05-26T08:15:00'),
  title: 'Running',
  description: 'Morning run',
  resource: 'r2',
};

const resources: CalendarResource[] = [
  {
    id: 'r1',
    name: 'Work',
    eventColor: 'blue',
  },
  {
    id: 'r2',
    name: 'Personal',
    eventColor: 'cyan',
  },
];

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
      <StandaloneView events={[calendarEvent]} resources={resources}>
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
    expect(screen.getByRole('combobox', { name: /resource/i }).textContent).to.match(/personal/i);
    expect(screen.getByRole('combobox', { name: /recurrence/i }).textContent).to.match(
      /don't repeat/i,
    );
  });

  it('should call "onEventsChange" with updated values on submit', async () => {
    const onEventsChange = spy();
    const { user } = render(
      <StandaloneView
        events={[calendarEvent]}
        onEventsChange={onEventsChange}
        resources={resources}
      >
        <Popover.Root open>
          <EventPopover {...defaultProps} />
        </Popover.Root>
      </StandaloneView>,
    );
    await user.type(screen.getByLabelText(/event title/i), ' test');
    await user.click(screen.getByRole('checkbox', { name: /all day/i }));
    await user.click(screen.getByRole('combobox', { name: /recurrence/i }));
    await user.click(await screen.findByRole('option', { name: /repeats daily/i }));
    await user.click(screen.getByRole('combobox', { name: /resource/i }));
    await user.click(await screen.findByRole('option', { name: /work/i }));
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    expect(onEventsChange.calledOnce).to.equal(true);
    const updated = onEventsChange.firstCall.firstArg[0];

    const expectedUpdatedEvent = {
      id: '1',
      title: 'Running test',
      description: 'Morning run',
      start: adapter.setMinutes(adapter.setHours(calendarEvent.start, 0), 0),
      end: adapter.setMinutes(adapter.setHours(calendarEvent.end, 23), 59),
      allDay: true,
      rrule: { freq: 'DAILY', interval: 1 },
      resource: 'r1',
    };

    expect(updated).to.deep.equal(expectedUpdatedEvent);
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
      <StandaloneView events={[calendarEvent]} resources={resources}>
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
    expect(screen.getByRole('combobox', { name: /resource/i })).to.have.attribute('aria-readonly');
    expect(screen.getByRole('combobox', { name: /recurrence/i })).to.have.attribute(
      'aria-readonly',
    );
    expect(screen.queryByRole('button', { name: /save changes/i })).to.equal(null);
    expect(screen.queryByRole('button', { name: /delete event/i })).to.equal(null);
  });
});
