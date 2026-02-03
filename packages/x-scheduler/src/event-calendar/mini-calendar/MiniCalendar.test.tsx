import { spy } from 'sinon';
import { screen, waitFor, within } from '@mui/internal-test-utils';
import { createSchedulerRenderer } from 'test/utils/scheduler';
import { EventCalendar } from '@mui/x-scheduler/event-calendar';

describe('MiniCalendar', () => {
  const { render } = createSchedulerRenderer({ clockConfig: new Date('2025-05-26T10:00:00Z') });

  // Helper to get the mini calendar element
  const getMiniCalendar = () => screen.getByRole('grid', { name: /calendar/i });

  describe('Rendering', () => {
    it('should render the mini calendar with month label', () => {
      render(<EventCalendar events={[]} />);

      // Should find the mini calendar grid
      const miniCalendar = getMiniCalendar();
      expect(miniCalendar).not.to.equal(null);

      // Should display May 2025 inside the mini calendar
      expect(within(miniCalendar).getByText(/May 2025/i)).not.to.equal(null);
    });

    it('should render weekday headers inside the mini calendar', () => {
      render(<EventCalendar events={[]} />);

      const miniCalendar = getMiniCalendar();
      // Check for columnheaders within the mini calendar
      const weekdayHeaders = within(miniCalendar).getAllByRole('columnheader');
      expect(weekdayHeaders.length).to.equal(7);
    });

    it('should highlight today with data-today attribute', () => {
      render(<EventCalendar events={[]} />);

      const miniCalendar = getMiniCalendar();
      // Find buttons within the mini calendar that have aria-selected attribute (mini calendar day buttons)
      const dayButtons = within(miniCalendar).getAllByRole('button');
      // Find the one with aria-current="date" (today)
      const todayButton = dayButtons.find((btn) => btn.getAttribute('aria-current') === 'date');

      expect(todayButton).not.to.equal(undefined);
      expect(todayButton?.getAttribute('data-today')).to.equal('true');
    });

    it('should highlight the active/visible date with data-active attribute', () => {
      render(<EventCalendar events={[]} defaultVisibleDate="2025-05-20T00:00:00Z" />);

      const miniCalendar = getMiniCalendar();
      const dayButtons = within(miniCalendar).getAllByRole('button');
      // Find the one with aria-selected="true"
      const activeButton = dayButtons.find((btn) => btn.getAttribute('aria-selected') === 'true');

      expect(activeButton).not.to.equal(undefined);
      expect(activeButton?.getAttribute('data-active')).to.equal('true');
    });

    it('should mark days from other months with data-other-month attribute', () => {
      render(<EventCalendar events={[]} />);

      const miniCalendar = getMiniCalendar();
      const dayButtons = within(miniCalendar).getAllByRole('button');
      // Find any button with data-other-month attribute
      const otherMonthButton = dayButtons.find(
        (btn) => btn.getAttribute('data-other-month') === 'true',
      );

      expect(otherMonthButton).not.to.equal(undefined);
    });
  });

  describe('Navigation', () => {
    it('should navigate to previous month when clicking previous button', async () => {
      const { user } = render(<EventCalendar events={[]} />);

      const miniCalendar = getMiniCalendar();
      expect(within(miniCalendar).getByText(/May 2025/i)).not.to.equal(null);

      const prevButton = screen.getByRole('button', { name: /show previous month in calendar/i });
      await user.click(prevButton);

      expect(within(miniCalendar).getByText(/April 2025/i)).not.to.equal(null);
    });

    it('should navigate to next month when clicking next button', async () => {
      const { user } = render(<EventCalendar events={[]} />);

      const miniCalendar = getMiniCalendar();
      expect(within(miniCalendar).getByText(/May 2025/i)).not.to.equal(null);

      const nextButton = screen.getByRole('button', { name: /show next month in calendar/i });
      await user.click(nextButton);

      expect(within(miniCalendar).getByText(/June 2025/i)).not.to.equal(null);
    });

    it('should call onVisibleDateChange when clicking a day', async () => {
      const onVisibleDateChange = spy();
      const { user } = render(
        <EventCalendar events={[]} onVisibleDateChange={onVisibleDateChange} defaultView="week" />,
      );

      const miniCalendar = getMiniCalendar();
      const dayButtons = within(miniCalendar).getAllByRole('button');
      // Find a day that is not the currently selected one
      const day15Button = dayButtons.find((btn) => btn.textContent === '15');

      expect(day15Button).not.to.equal(undefined);
      await user.click(day15Button!);

      expect(onVisibleDateChange.calledOnce).to.equal(true);
    });

    it('should not change the view when clicking a day', async () => {
      const onViewChange = spy();
      const { user } = render(
        <EventCalendar events={[]} onViewChange={onViewChange} defaultView="week" />,
      );

      const miniCalendar = getMiniCalendar();
      const dayButtons = within(miniCalendar).getAllByRole('button');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15');

      expect(day15Button).not.to.equal(undefined);
      await user.click(day15Button!);

      // onViewChange should NOT be called (view should remain week)
      expect(onViewChange.called).to.equal(false);
    });

    it('should sync mini calendar month when scheduler visibleDate changes', async () => {
      const { user } = render(
        <EventCalendar events={[]} defaultVisibleDate="2025-05-26T00:00:00Z" />,
      );

      // Initially the mini calendar shows May 2025
      const miniCalendar = getMiniCalendar();
      expect(within(miniCalendar).getByText(/May 2025/i)).not.to.equal(null);

      // Click on the mini calendar's next month navigation
      const nextMonthButton = screen.getByRole('button', { name: /show next month in calendar/i });
      await user.click(nextMonthButton);

      // Now mini calendar shows June 2025
      expect(within(miniCalendar).getByText(/June 2025/i)).not.to.equal(null);

      // Click on a day in June
      const dayButtons = within(miniCalendar).getAllByRole('button');
      const day15Button = dayButtons.find((btn) => btn.textContent === '15');

      expect(day15Button).not.to.equal(undefined);
      await user.click(day15Button!);

      // Mini calendar should still show June after clicking a day
      await waitFor(() => {
        expect(within(miniCalendar).getByText(/June 2025/i)).not.to.equal(null);
      });
    });
  });

  describe('Accessibility', () => {
    it('should have proper ARIA attributes on the grid', () => {
      render(<EventCalendar events={[]} />);

      const grid = getMiniCalendar();
      expect(grid).not.to.equal(null);
      expect(grid.getAttribute('role')).to.equal('grid');
      expect(grid.getAttribute('aria-label')).to.equal('Calendar');
    });

    it('should have aria-current="date" on today', () => {
      render(<EventCalendar events={[]} />);

      const miniCalendar = getMiniCalendar();
      const dayButtons = within(miniCalendar).getAllByRole('button');
      const todayButton = dayButtons.find((btn) => btn.getAttribute('aria-current') === 'date');

      expect(todayButton).not.to.equal(undefined);
    });

    it('should have aria-selected on the active day', () => {
      render(<EventCalendar events={[]} defaultVisibleDate="2025-05-20T00:00:00Z" />);

      const miniCalendar = getMiniCalendar();
      const dayButtons = within(miniCalendar).getAllByRole('button');
      const activeButton = dayButtons.find((btn) => btn.getAttribute('aria-selected') === 'true');

      expect(activeButton).not.to.equal(undefined);
    });

    it('should have accessible labels on weekday headers', () => {
      render(<EventCalendar events={[]} />);

      const miniCalendar = getMiniCalendar();
      const weekdayHeaders = within(miniCalendar).getAllByRole('columnheader');

      // Check that headers have aria-labels with full weekday names
      const sundayHeader = weekdayHeaders.find(
        (header) => header.getAttribute('aria-label')?.toLowerCase() === 'sunday',
      );
      expect(sundayHeader).not.to.equal(undefined);

      const mondayHeader = weekdayHeaders.find(
        (header) => header.getAttribute('aria-label')?.toLowerCase() === 'monday',
      );
      expect(mondayHeader).not.to.equal(undefined);
    });
  });

  describe('Side panel visibility', () => {
    it('should not be visible when side panel is closed', async () => {
      const { user } = render(<EventCalendar events={[]} />);

      // Initially the mini calendar should be visible
      expect(getMiniCalendar()).not.to.equal(null);

      // Close the side panel
      const closeSidePanelButton = screen.getByRole('button', { name: /close side panel/i });
      await user.click(closeSidePanelButton);

      // Check that the side panel is collapsed (open side panel button appears)
      await waitFor(() => {
        const openSidePanelButton = screen.queryByRole('button', { name: /open side panel/i });
        expect(openSidePanelButton).not.to.equal(null);
      });
    });
  });
});
