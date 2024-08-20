import * as React from 'react';
import { screen, fireEvent } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  openPicker,
  describeValidation,
  describeValue,
  describePicker,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { MobileDatePicker } from '@mui/x-date-pickers/MobileDatePicker';
import { describeConformance } from 'test/utils/describeConformance';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<MobileDatePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describePicker(MobileDatePicker, { render, fieldType: 'single-input', variant: 'mobile' });

  describeValidation(MobileDatePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));

  describeConformance(<MobileDatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiMobileDatePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
    ],
  }));

  describeValue(MobileDatePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date',
    variant: 'mobile',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    clock,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (value, { isOpened, applySameValue }) => {
      if (!isOpened) {
        openPicker({ type: 'date', variant: 'mobile' });
      }

      const newValue = applySameValue ? value : adapterToUse.addDays(value, 1);
      fireUserEvent.mousePress(
        screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
      );

      // Close the picker to return to the initial state
      if (!isOpened) {
        // eslint-disable-next-line material-ui/disallow-active-element-as-key-event-target
        fireEvent.keyDown(document.activeElement!, { key: 'Escape' });
        clock.runToLast();
      }

      return newValue;
    },
  }));
});
