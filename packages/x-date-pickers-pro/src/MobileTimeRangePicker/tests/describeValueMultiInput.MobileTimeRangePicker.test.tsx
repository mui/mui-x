import { fireEvent, screen } from '@mui/internal-test-utils';
import { PickerNonNullableRangeValue, PickerRangeValue } from '@mui/x-date-pickers/internals';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  describeValue,
  getFieldSectionsContainer,
  openPicker,
} from 'test/utils/pickers';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import { MultiInputTimeRangeField } from '@mui/x-date-pickers-pro/MultiInputTimeRangeField';

describe('<MobileTimeRangePicker /> - Describe Value Multi Input', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeValue<PickerRangeValue, 'picker'>(MobileTimeRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'time-range',
    variant: 'mobile',
    initialFocus: 'start',
    fieldType: 'multi-input',
    defaultProps: {
      slots: { field: MultiInputTimeRangeField },
    },
    clock,
    values: [
      // initial start and end dates
      [adapterToUse.date('2018-01-01T11:30:00'), adapterToUse.date('2018-01-04T11:45:00')],
      // start and end dates after `setNewValue`
      [adapterToUse.date('2018-01-02T12:35:00'), adapterToUse.date('2018-01-05T12:50:00')],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      const expectedPlaceholder = hasMeridiem ? 'hh:mm aa' : 'hh:mm';

      const startSectionsContainer = getFieldSectionsContainer(0);
      const expectedStartValueStr = expectedValues[0]
        ? adapterToUse.format(expectedValues[0], hasMeridiem ? 'fullTime12h' : 'fullTime24h')
        : expectedPlaceholder;
      expectFieldValueV7(startSectionsContainer, expectedStartValueStr);

      const endSectionsContainer = getFieldSectionsContainer(1);
      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(expectedValues[1], hasMeridiem ? 'fullTime12h' : 'fullTime24h')
        : expectedPlaceholder;
      expectFieldValueV7(endSectionsContainer, expectedEndValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue, setEndDate = false }) => {
      if (!isOpened) {
        openPicker({
          type: 'time-range',
          initialFocus: setEndDate ? 'end' : 'start',
          fieldType: 'multi-input',
        });
      }
      let newValue: PickerNonNullableRangeValue;
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [value[0], adapterToUse.addMinutes(adapterToUse.addHours(value[1], 1), 5)];
      } else {
        newValue = [adapterToUse.addMinutes(adapterToUse.addHours(value[0], 1), 5), value[1]];
      }

      const hasMeridiem = adapterToUse.is12HourCycleInCurrentLocale();
      // if we want to set the end time, we firstly need to switch to end time "range position"
      if (setEndDate) {
        const toolbarHourButtons = screen.getAllByRole('button', {
          name: adapterToUse.format(value[1], hasMeridiem ? 'hours12h' : 'hours24h'),
        });
        fireEvent.click(toolbarHourButtons[toolbarHourButtons.length - 1]);
      }

      const hours = adapterToUse.format(
        newValue[setEndDate ? 1 : 0],
        hasMeridiem ? 'hours12h' : 'hours24h',
      );
      const hoursNumber = adapterToUse.getHours(newValue[setEndDate ? 1 : 0]);
      fireEvent.click(screen.getByRole('option', { name: `${parseInt(hours, 10)} hours` }));
      fireEvent.click(
        screen.getByRole('option', {
          name: `${adapterToUse.getMinutes(newValue[setEndDate ? 1 : 0])} minutes`,
        }),
      );
      if (hasMeridiem) {
        // meridiem is an extra view on `MobileDateTimeRangePicker`
        // we need to click it to finish selection
        fireEvent.click(screen.getByRole('option', { name: hoursNumber >= 12 ? 'PM' : 'AM' }));
      }
      // Close the picker
      if (!isOpened) {
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
      } else {
        const toolbarHourButtons = screen.getAllByRole('button', {
          name: adapterToUse.format(newValue[0], hasMeridiem ? 'hours12h' : 'hours24h'),
        });
        // return to the start time view in case we'd like to repeat the selection process
        fireEvent.click(toolbarHourButtons[0]);
      }

      return newValue;
    },
  }));
});
