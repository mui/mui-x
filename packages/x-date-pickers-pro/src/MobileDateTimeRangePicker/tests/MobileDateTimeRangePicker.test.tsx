import { screen } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import {
  createPickerRenderer,
  openPicker,
  getFieldSectionsContainer,
  expectFieldValue,
} from 'test/utils/pickers';
import { MobileDateTimeRangePicker } from '@mui/x-date-pickers-pro/MobileDateTimeRangePicker';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('<MobileDateTimeRangePicker />', () => {
  const { render } = createPickerRenderer();

  describe('value selection', () => {
    beforeEach(() => {
      vi.setSystemTime(new Date(2018, 0, 10, 10, 16, 0));
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should cycle focused views among the visible step after selection', async () => {
      const { user } = render(<MobileDateTimeRangePicker />);

      await openPicker(user, {
        type: 'date-time-range',
        initialFocus: 'start',
        fieldType: 'single-input',
      });

      const day = screen.getByRole('gridcell', { name: '10' });
      expect(day).toHaveFocus();
      await user.click(day);

      await user.click(screen.getByRole('button', { name: 'Next' }));

      await user.click(screen.getByRole('option', { name: '12 hours' }));

      const minutes = screen.getByRole('option', { name: '0 minutes' });
      expect(minutes).toHaveFocus();
      await user.click(minutes);

      const meridiem = screen.getByRole('option', { name: 'AM' });
      expect(meridiem).toHaveFocus();
      const sectionsContainer = getFieldSectionsContainer();
      expectFieldValue(sectionsContainer, '01/10/2018 12:00 AM – MM/DD/YYYY hh:mm aa');
    });
  });

  it('should pass the owner state to every tabs slot', () => {
    const theme = createTheme({
      components: {
        MuiDateTimeRangePickerTabs: {
          styleOverrides: {
            root: ({ ownerState }) => ({
              opacity: ownerState.pickerVariant === 'mobile' ? 1 : 0.5,
            }),
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <MobileDateTimeRangePicker open slotProps={{ tabs: { hidden: false } }} />
      </ThemeProvider>,
    );

    expect(screen.getByRole('button', { name: 'Start date' })).toBeVisible();
  });

  it('should pass the toolbar owner state to every toolbar slot', () => {
    const toolbarDirections: Array<string | undefined> = [];
    const theme = createTheme({
      components: {
        MuiDateTimeRangePickerToolbar: {
          styleOverrides: {
            root: ({ ownerState }) => {
              toolbarDirections.push(ownerState.toolbarDirection);
              return {};
            },
          },
        },
      },
    });

    render(
      <ThemeProvider theme={theme}>
        <MobileDateTimeRangePicker open />
      </ThemeProvider>,
    );

    expect(toolbarDirections).not.to.have.length(0);
    expect(toolbarDirections).not.to.include(undefined);
  });
});
