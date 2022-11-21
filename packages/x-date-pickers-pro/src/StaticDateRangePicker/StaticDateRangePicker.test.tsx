import * as React from 'react';
import { expect } from 'chai';
import { isWeekend } from 'date-fns';
import TextField, { TextFieldProps } from '@mui/material/TextField';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { describeConformance, screen } from '@mui/monorepo/test/utils';
import {
  wrapPickerMount,
  createPickerRenderer,
  adapterToUse,
  withPickerControls,
} from 'test/utils/pickers-utils';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';

const defaultRangeRenderInput = (startProps: TextFieldProps, endProps: TextFieldProps) => (
  <React.Fragment>
    <TextField {...startProps} />
    <TextField {...endProps} />
  </React.Fragment>
);

const WrappedStaticDateTimePicker = withPickerControls(StaticDateRangePicker)({
  renderInput: defaultRangeRenderInput,
});

describe('<StaticDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(
    <StaticDateRangePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={[null, null]}
    />,
    () => ({
      classes: {},
      muiName: 'MuiStaticDateRangePicker',
      wrapMount: wrapPickerMount,
      refInstanceof: undefined,
      skip: [
        'componentProp',
        'componentsProp',
        'themeDefaultProps',
        'themeStyleOverrides',
        'themeVariants',
        'mergeClassName',
        'propsSpread',
        'refForwarding',
        'rootClass',
        'reactTestRenderer',
      ],
    }),
  );

  describeRangeValidation(StaticDateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'legacy-picker',
    views: ['day'],
    mode: 'mobile',
  }));

  it('allows disabling dates', () => {
    render(
      <StaticDateRangePicker
        renderInput={defaultRangeRenderInput}
        minDate={adapterToUse.date(new Date(2005, 0, 1))}
        shouldDisableDate={isWeekend}
        onChange={() => {}}
        value={[adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 31))]}
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
        renderInput={defaultRangeRenderInput}
        onChange={() => {}}
        value={[adapterToUse.date(new Date(2018, 0, 1)), adapterToUse.date(new Date(2018, 0, 31))]}
      />,
    );

    // It should follow https://www.w3.org/WAI/ARIA/apg/example-index/dialog-modal/datepicker-dialog.html
    expect(
      document.querySelector(
        '[role="grid"] [role="rowgroup"] > [role="row"] button[role="gridcell"]',
      ),
    ).to.have.text('1');
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(
        <WrappedStaticDateTimePicker
          initialValue={[null, null]}
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
        />,
      );

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
