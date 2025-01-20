import * as React from 'react';
import { fireEvent, screen } from '@mui/internal-test-utils';
import {
  createPickerRenderer,
  adapterToUse,
  expectFieldValueV7,
  describeValidation,
  describeValue,
  describePicker,
  getFieldInputRoot,
} from 'test/utils/pickers';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { PickerValue } from '@mui/x-date-pickers/internals';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DesktopDatePicker /> - Describes', () => {
  const { render } = createPickerRenderer();

  describePicker(DesktopDatePicker, { render, fieldType: 'single-input', variant: 'desktop' });

  describeValidation(DesktopDatePicker, () => ({
    render,
    views: ['year', 'month', 'day'],
    componentFamily: 'picker',
  }));

  describeConformance(<DesktopDatePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDatePicker',
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

  describeValue<PickerValue, 'picker'>(DesktopDatePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date',
    variant: 'desktop',
    values: [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-02')],
    emptyValue: null,
    assertRenderedValue: (expectedValue: any) => {
      const fieldRoot = getFieldInputRoot();

      const expectedValueStr = expectedValue
        ? adapterToUse.format(expectedValue, 'keyboardDate')
        : 'MM/DD/YYYY';

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: async (value, _, { isOpened, applySameValue, selectSection, pressKey }) => {
      const newValue = applySameValue ? value! : adapterToUse.addDays(value!, 1);

      if (isOpened) {
        fireEvent.click(
          screen.getByRole('gridcell', { name: adapterToUse.getDate(newValue).toString() }),
        );
      } else {
        selectSection('day');
        pressKey(undefined, 'ArrowUp');
      }

      return newValue;
    },
  }));
});
