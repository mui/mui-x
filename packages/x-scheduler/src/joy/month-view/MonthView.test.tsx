import * as React from 'react';
import { DateTime } from 'luxon';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { screen, within } from '@mui/internal-test-utils';
import { CalendarEvent } from '@mui/x-scheduler/joy';
import { spy } from 'sinon';
import { MonthView } from './MonthView';
import { StandaloneView } from '../standalone-view/StandaloneView';

const events: CalendarEvent[] = [
  {
    id: '1',
    start: DateTime.fromISO('2025-05-01T09:00:00'),
    end: DateTime.fromISO('2025-05-01T10:00:00'),
    title: 'Meeting',
  },
  {
    id: '2',
    start: DateTime.fromISO('2025-05-15T14:00:00'),
    end: DateTime.fromISO('2025-05-15T15:00:00'),
    title: 'Doctor Appointment',
  },
];

describe('<MonthView />', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-01') });

  const standaloneDefaults = {
    events,
    resources: [],
  };

  it('should render the weekday headers', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView />
      </StandaloneView>,
    );
    const headerTexts = screen.getAllByRole('columnheader').map((header) => header.textContent);
    expect(headerTexts).to.include.members(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });

  it('should render a cell for each day of the month', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView />
      </StandaloneView>,
    );
    const gridCells = screen.getAllByRole('gridcell');
    expect(gridCells.length).to.be.at.least(31);
  });

  it('should show the abbreviated month for day 1', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView />
      </StandaloneView>,
    );
    expect(screen.getByText(/may 1/i)).not.to.equal(null);
  });

  it('should render events in the correct cell', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView />
      </StandaloneView>,
    );

    const gridCells = screen.getAllByRole('gridcell');
    const may1Cell = gridCells.find((cell) => within(cell).queryByText(/may 1/i));
    const may15Cell = gridCells.find((cell) => within(cell).queryByText(/15/));

    expect(within(may1Cell!).getByText('Meeting')).not.to.equal(null);
    expect(within(may15Cell!).getByText('Doctor Appointment')).not.to.equal(null);
  });

  it('should call onDayHeaderClick when a day is clicked', async () => {
    const handleClick = spy();
    const { user } = render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView onDayHeaderClick={handleClick} />
      </StandaloneView>,
    );
    const button = screen.getByRole('button', { name: '15' });
    await user.click(button);

    expect(handleClick.calledOnce).to.equal(true);
    expect(handleClick.firstCall.args[0].day).to.equal(15);
  });

  it('should render day numbers as plain text when onDayHeaderClick is not provided', () => {
    render(
      <StandaloneView {...standaloneDefaults}>
        <MonthView />
      </StandaloneView>,
    );
    expect(screen.queryByRole('button', { name: '15' })).to.equal(null);
    expect(screen.getByText('15')).not.to.equal(null);
  });
});
