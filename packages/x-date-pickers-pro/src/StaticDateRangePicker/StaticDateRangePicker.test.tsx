import * as React from 'react';
import { isWeekend } from 'date-fns';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, adapterToUse, describeRangeValidation } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<StaticDateRangePicker />', () => {
  const { render } = createPickerRenderer();

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
    componentFamily: 'static-picker',
    views: ['day'],
    variant: 'mobile',
    fieldType: 'no-input',
  }));

  it('allows disabling dates', () => {
    render(
      <StaticDateRangePicker
        minDate={adapterToUse.date('2005-01-01')}
        shouldDisableDate={isWeekend as any}
        defaultValue={[adapterToUse.date('2018-01-01'), adapterToUse.date('2018-01-31')]}
      />,
    );

    expect(
      screen
        .getAllByTestId('DateRangePickerDay')
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
        '[role="grid"] [role="rowgroup"] > [role="row"] [role="gridcell"][data-testid="DateRangePickerDay"]',
      ),
    ).to.have.text('1');
  });
});
