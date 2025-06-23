import * as React from 'react';
import { DateTime } from 'luxon';
import { screen, fireEvent } from '@mui/internal-test-utils';
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

  it('should call onEventEdit with updated values on submit', () => {
    const onEventEdit = spy();
    render(
      <Popover.Root open>
        <EventPopover {...defaultProps} onEventEdit={onEventEdit} />
      </Popover.Root>,
    );
    fireEvent.change(screen.getByRole('textbox', { name: /event title/i }), {
      target: { value: 'Updated title' },
    });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(onEventEdit.calledOnce).to.equal(true);
    expect(onEventEdit.firstCall.args[0].title).to.equal('Updated title');
  });

  it('should show error if start date is after end date', () => {
    render(
      <Popover.Root open>
        <EventPopover {...defaultProps} />
      </Popover.Root>,
    );
    fireEvent.change(screen.getByLabelText(/start date/i), { target: { value: '2025-05-27' } });
    fireEvent.change(screen.getByLabelText(/end date/i), { target: { value: '2025-05-26' } });
    fireEvent.click(screen.getByRole('button', { name: /save changes/i }));
    expect(screen.getByRole('alert').textContent).to.match(/start.*before.*end/i);
  });
});
