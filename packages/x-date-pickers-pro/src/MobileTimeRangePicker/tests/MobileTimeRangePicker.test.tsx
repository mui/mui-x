import { screen } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import type { PickerOwnerState } from '@mui/x-date-pickers/models';
import type { PickerToolbarOwnerState } from '@mui/x-date-pickers/internals';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import { timeRangePickerToolbarClasses } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { createPickerRenderer } from 'test/utils/pickers';
import { describe, it, expect } from 'vitest';

describe('<MobileTimeRangePicker />', () => {
  const { render } = createPickerRenderer();

  // The extra `createTheme` argument is untyped: the theme keys of the time range pickers are typed in https://github.com/mui/mui-x/pull/24284.
  describe('theme style overrides', () => {
    it('should pass the owner state to every tabs slot', () => {
      const theme = createTheme(
        {},
        {
          components: {
            MuiTimeRangePickerTabs: {
              styleOverrides: {
                root: ({ ownerState }: { ownerState: PickerOwnerState }) => ({
                  opacity: ownerState.pickerVariant === 'mobile' ? 1 : 0.5,
                }),
              },
            },
          },
        },
      );

      render(
        <ThemeProvider theme={theme}>
          <MobileTimeRangePicker open slotProps={{ tabs: { hidden: false } }} />
        </ThemeProvider>,
      );

      expect(screen.getAllByRole('tab')).to.have.length(2);
    });

    it('should pass the owner state to every toolbar slot', () => {
      const theme = createTheme(
        {},
        {
          components: {
            MuiTimeRangePickerToolbar: {
              styleOverrides: {
                root: ({ ownerState }: { ownerState: PickerToolbarOwnerState }) => ({
                  direction: ownerState.toolbarDirection,
                }),
              },
            },
          },
        },
      );

      render(
        <ThemeProvider theme={theme}>
          <MobileTimeRangePicker open />
        </ThemeProvider>,
      );

      expect(screen.getByText('Select time range')).toBeVisible();
    });
  });

  it('should apply the `timeContainer` class to the start and end time containers', () => {
    render(<MobileTimeRangePicker open />);

    expect(
      document.querySelectorAll(`.${timeRangePickerToolbarClasses.timeContainer}`),
    ).to.have.length(2);
  });
});
