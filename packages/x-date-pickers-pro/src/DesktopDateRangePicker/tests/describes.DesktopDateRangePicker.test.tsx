import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import {
  adapterToUse,
  createPickerRenderer,
  expectFieldValueV7,
  describePicker,
  describeValue,
  describeRangeValidation,
  getFieldInputRoot,
  getFieldSectionsContainer,
} from 'test/utils/pickers';
import { DesktopDateRangePicker } from '@mui/x-date-pickers-pro/DesktopDateRangePicker';
import { SingleInputDateRangeField } from '@mui/x-date-pickers-pro/SingleInputDateRangeField';
import { describeConformance } from 'test/utils/describeConformance';
import { fireUserEvent } from 'test/utils/fireUserEvent';

describe('<DesktopDateRangePicker /> - Describes', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describePicker(DesktopDateRangePicker, { render, fieldType: 'multi-input', variant: 'desktop' });

  describeRangeValidation(DesktopDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'picker',
    views: ['day'],
  }));

  describeConformance(<DesktopDateRangePicker enableAccessibleFieldDOMStructure />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDateRangePicker',
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

  describeValue(DesktopDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'desktop',
    initialFocus: 'start',
    clock,
    values: [
      // initial start and end dates
      [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-04')],
      // start and end dates after `setNewValue`
      [adapterToUse.date('2018-01-02'), adapterToUse.date('2018-01-05')],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const startSectionsContainer = getFieldSectionsContainer(0);
      const expectedStartValueStr = expectedValues[0]
        ? adapterToUse.format(expectedValues[0], 'keyboardDate')
        : 'MM/DD/YYYY';
      expectFieldValueV7(startSectionsContainer, expectedStartValueStr);

      const endSectionsContainer = getFieldSectionsContainer(1);
      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(expectedValues[1], 'keyboardDate')
        : 'MM/DD/YYYY';
      expectFieldValueV7(endSectionsContainer, expectedEndValueStr);
    },
    setNewValue: (
      value,
      { isOpened, applySameValue, setEndDate = false, selectSection, pressKey },
    ) => {
      let newValue: any[];
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [value[0], adapterToUse.addDays(value[1], 1)];
      } else {
        newValue = [adapterToUse.addDays(value[0], 1), value[1]];
      }

      if (isOpened) {
        fireUserEvent.mousePress(
          screen.getAllByRole('gridcell', {
            name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
          })[0],
        );
      } else {
        selectSection('day');
        pressKey(undefined, 'ArrowUp');
      }

      return newValue;
    },
  }));

  // With single input field
  describeValue(DesktopDateRangePicker, () => ({
    render,
    componentFamily: 'picker',
    type: 'date-range',
    variant: 'desktop',
    initialFocus: 'start',
    isSingleInput: true,
    defaultProps: {
      slots: { field: SingleInputDateRangeField },
    },
    clock,
    values: [
      // initial start and end dates
      [adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-04')],
      // start and end dates after `setNewValue`
      [adapterToUse.date('2018-01-02'), adapterToUse.date('2018-01-05')],
    ],
    emptyValue: [null, null],
    assertRenderedValue: (expectedValues: any[]) => {
      const fieldRoot = getFieldInputRoot(0);

      const expectedStartValueStr = expectedValues[0]
        ? adapterToUse.format(expectedValues[0], 'keyboardDate')
        : 'MM/DD/YYYY';

      const expectedEndValueStr = expectedValues[1]
        ? adapterToUse.format(expectedValues[1], 'keyboardDate')
        : 'MM/DD/YYYY';

      const expectedValueStr = `${expectedStartValueStr} – ${expectedEndValueStr}`;

      expectFieldValueV7(fieldRoot, expectedValueStr);
    },
    setNewValue: (
      value,
      { isOpened, applySameValue, setEndDate = false, selectSection, pressKey },
    ) => {
      let newValue: any[];
      if (applySameValue) {
        newValue = value;
      } else if (setEndDate) {
        newValue = [value[0], adapterToUse.addDays(value[1], 1)];
      } else {
        newValue = [adapterToUse.addDays(value[0], 1), value[1]];
      }

      if (isOpened) {
        fireUserEvent.mousePress(
          screen.getAllByRole('gridcell', {
            name: adapterToUse.getDate(newValue[setEndDate ? 1 : 0]).toString(),
          })[0],
        );
      } else {
        selectSection('day');
        pressKey(undefined, 'ArrowUp');
      }

      return newValue;
    },
  }));
});
