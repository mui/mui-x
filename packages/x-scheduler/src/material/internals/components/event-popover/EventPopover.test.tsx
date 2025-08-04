import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/primitives/models';
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

const calendarEventResource: CalendarResource = {
  id: 'r1',
  name: 'Personal',
  color: 'cyan',
};

describe('<EventPopover />', () => {
  const anchor = document.createElement('button');
  document.body.appendChild(anchor);

  const defaultProps = {
    anchor,
    container: document.body,
    calendarEvent,
    calendarEventResource,
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
    await user.click(screen.getByRole('button', { name: /save changes/i }));
    expect(onEventsChange.calledOnce).to.equal(true);
    expect(onEventsChange.firstCall.firstArg[0].title).to.equal('Running test');
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
});
