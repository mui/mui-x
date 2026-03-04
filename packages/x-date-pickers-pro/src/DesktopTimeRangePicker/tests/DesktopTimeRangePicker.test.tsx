import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, adapterToUse, openPickers } from 'test/utils/pickers';
import { vi } from 'vitest';
import { DesktopTimeRangePicker } from '@mui/x-date-pickers-pro/DesktopTimeRangePicker';

describe('<DesktopTimeRangePicker />', () => {
  const { render } = createPickerRenderer();

  beforeEach(() => {
    vi.setSystemTime(new Date(2018, 0, 10, 10, 16, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('value selection', () => {
    it('should work with separate start and end "reference" dates', async () => {
      const { user } = render(
        <DesktopTimeRangePicker
          referenceDate={[
            adapterToUse.date('2018-01-01T10:15:00'),
            adapterToUse.date('2018-01-06T14:20:00'),
          ]}
        />,
      );

      await openPickers(user, {
        type: 'time-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      expect(document.activeElement).to.equal(screen.getByRole('option', { name: '10 hours' }));
      await user.click(screen.getByRole('option', { name: '10 hours' }));

      expect(screen.getByRole('option', { name: '15 minutes', selected: true })).not.to.equal(null);

      await user.click(screen.getByRole('button', { name: 'Next' }));
      await user.tab(); // Move focus to the end time hour from the "Next" button

      expect(document.activeElement).to.equal(screen.getByRole('option', { name: '2 hours' }));
      await user.click(screen.getByRole('option', { name: '2 hours' }));
      expect(screen.getByRole('option', { name: '20 minutes', selected: true })).not.to.equal(null);
    });
  });
});
