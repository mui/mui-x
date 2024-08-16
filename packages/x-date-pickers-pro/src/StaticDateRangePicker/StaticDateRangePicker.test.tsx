import * as React from 'react';
import { expect } from 'chai';
import { isWeekend } from 'date-fns';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, adapterToUse, describeRangeValidation } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StaticDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeConformance(<StaticDateRangePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiStaticDateRangePicker',
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

  describeRangeValidation(StaticDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'static-picker',
    views: ['day'],
    variant: 'mobile',
  }));

  it('allows disabling dates', () => {
    render(
      <StaticDateRangePicker
        minDate={adapterToUse.date('2005-01-01')}
        shouldDisableDate={isWeekend}
        defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-31')]}
      />,
    );

    expect(
      screen
        .getAllByMuiTest('DateRangePickerDay')
        .filter((day) => day.getAttribute('disabled') !== undefined),
    ).to.have.length(31);
  });

  it('should render the correct a11y tree structure', () => {
    render(
      <StaticDateRangePicker
        defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-31')]}
      />,
    );

    // It should follow https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
    expect(
      document.querySelector(
        '[role="grid"] [role="rowgroup"] > [role="row"] button[role="gridcell"]',
      ),
    ).to.have.text('1');
  });
});
