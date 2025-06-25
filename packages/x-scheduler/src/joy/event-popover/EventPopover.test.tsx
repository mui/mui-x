import * as React from 'react';
import { DateTime } from 'luxon';
import { screen } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { CalendarEvent, CalendarResource } from '@mui/x-scheduler/joy';
import { spy } from 'sinon';
import { Popover } from '@base-ui-components/react/popover';
import { EventPopover } from './EventPopover';

const calendarEvent: CalendarEvent = {
  id: '1',
  start: DateTime.fromISO('2025-05-26T07:30:00'),
  end: DateTime.fromISO('2025-05-26T08:15:00'),
  title: 'Footing',
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
    onEventEdit: () => {},
    onEventDelete: () => {},
    onClose: () => {},
  };

  const { render } = createSchedulerRenderer();

  it('should render the event data in the form fields', () => {
    render(
      <Popover.Root open>
        <EventPopover {...defaultProps} />
      </Popover.Root>,
    );
    expect(screen.getByDisplayValue('Footing')).not.to.equal(null);
    expect(screen.getByDisplayValue('Morning run')).not.to.equal(null);
    expect(screen.getByLabelText(/start date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/end date/i)).to.have.value('2025-05-26');
    expect(screen.getByLabelText(/start time/i)).to.have.value('07:30');
    expect(screen.getByLabelText(/end time/i)).to.have.value('08:15');
  });

  it('should call onEventEdit with updated values on submit', async () => {
    const onEventEdit = spy();
    const { user } = render(
      <Popover.Root open>
        <EventPopover {...defaultProps} onEventEdit={onEventEdit} />
      </Popover.Root>,
    );
    await user.clear(screen.getByLabelText(/event title/i));
    await user.type(screen.getByLabelText(/event title/i), 'Updated title');
    await user.click(screen.getByRole('button', { name: /save changes/i }));
    expect(onEventEdit.calledOnce).to.equal(true);
    expect(onEventEdit.firstCall.args[0].title).to.equal('Updated title');
  });

  it('should show error if start date is after end date', async () => {
    const { user } = render(
      <Popover.Root open>
        <EventPopover {...defaultProps} />
      </Popover.Root>,
    );
    await user.clear(screen.getByLabelText(/start date/i));
    await user.type(screen.getByLabelText(/start date/i), '2025-05-27');
    await user.clear(screen.getByLabelText(/end date/i));
    await user.type(screen.getByLabelText(/end date/i), '2025-05-26');
    await user.click(screen.getByRole('button', { name: /save changes/i }));

    const errorDiv = document.querySelector('.EventPopoverDateTimeFieldsError [data-invalid]');
    expect(errorDiv?.textContent).to.match(/start.*before.*end/i);
  });

  it('should call onEventDelete with the event id when delete button is clicked', async () => {
    const onEventDelete = spy();
    const { user } = render(
      <Popover.Root open>
        <EventPopover {...defaultProps} onEventDelete={onEventDelete} />
      </Popover.Root>,
    );
    await user.click(screen.getByRole('button', { name: /delete event/i }));
    expect(onEventDelete.calledOnce).to.equal(true);
    expect(onEventDelete.firstCall.args[0]).to.equal('1');
  });
});
