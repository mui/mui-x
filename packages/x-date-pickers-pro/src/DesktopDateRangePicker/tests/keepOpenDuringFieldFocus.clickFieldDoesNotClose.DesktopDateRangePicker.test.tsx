import { screen } from '@mui/internal-test-utils';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { MultiInputDateRangeField } from '@mui/x-date-pickers-pro/MultiInputDateRangeField';
import {
  createPickerRenderer,
  getFieldSectionsContainer,
  openPickerAsync,
} from 'test/utils/pickers';

describe('DesktopDateRangePicker keepOpenDuringFieldFocus - clicking field should not close', () => {
  const { render } = createPickerRenderer();

  it('keeps popper open when clicking back into the field (single input)', async () => {
    const { user } = render(<DesktopDateRangePicker keepOpenDuringFieldFocus />);

    await openPickerAsync(user, {
      type: 'date-range',
      fieldType: 'single-input',
      initialFocus: 'start',
    });

    const textbox = getFieldSectionsContainer();
    await user.click(textbox);

    const popper = screen.queryByRole('dialog') ?? screen.queryByRole('tooltip');
    expect(popper).not.to.equal(null);
    expect(popper).toBeVisible();
  });

  it('keeps popper open when clicking back into one of the fields (multi input)', async () => {
    const { user } = render(
      <DesktopDateRangePicker
        keepOpenDuringFieldFocus
        slots={{ field: MultiInputDateRangeField }}
      />,
    );

    await openPickerAsync(user, {
      type: 'date-range',
      fieldType: 'multi-input',
      initialFocus: 'start',
    });

    const startField = getFieldSectionsContainer(0);
    await user.click(startField);

    const popper = screen.queryByRole('dialog') ?? screen.queryByRole('tooltip');
    expect(popper).not.to.equal(null);
    expect(popper).toBeVisible();
  });
});
