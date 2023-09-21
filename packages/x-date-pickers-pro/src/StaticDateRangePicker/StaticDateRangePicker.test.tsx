import * as React from 'react';
import { expect } from 'chai';
import { isWeekend } from 'date-fns';
import { StaticDateRangePicker } from '@mui/x-date-pickers-pro/StaticDateRangePicker';
import { describeConformance, screen, fireTouchChangedEvent } from '@mui/monorepo/test/utils';
import { wrapPickerMount, createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { spy } from 'sinon';

describe('<StaticDateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date(2018, 0, 1, 0, 0, 0, 0),
  });

  describeConformance(<StaticDateRangePicker />, () => ({
    classes: {} as any,
    render,
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
        minDate={adapterToUse.date(new Date(2005, 0, 1))}
        shouldDisableDate={isWeekend}
        defaultValue={[
          adapterToUse.date(new Date(2018, 0, 1)),
          adapterToUse.date(new Date(2018, 0, 31)),
        ]}
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
        defaultValue={[
          adapterToUse.date(new Date(2018, 0, 1)),
          adapterToUse.date(new Date(2018, 0, 31)),
        ]}
      />,
    );

    // It should follow https://www.w3.org/WAI/ARIA/apg/patterns/dialog-modal/examples/datepicker-dialog/
    expect(
      document.querySelector(
        '[role="grid"] [role="rowgroup"] > [role="row"] button[role="gridcell"]',
      ),
    ).to.have.text('1');
  });

  it('should be able to set same date twice as range', () => {
    const onChangeHandler = spy();
    render(
      <StaticDateRangePicker
        defaultValue={[
          adapterToUse.date(new Date(2022, 0, 17)),
          adapterToUse.date(new Date(2022, 0, 21)),
        ]}
        onChange={onChangeHandler}
      />,
    );

    const startDay = screen.getAllByMuiTest('DateRangePickerDay')[16];
    const { x, y } = startDay.getBoundingClientRect();
    const touchPoint = { clientX: x + 10, clientY: y + 10 };

    expect(onChangeHandler.callCount).to.equal(0);

    // fire event twice to simulate selecting the day as start and end of range
    fireTouchChangedEvent(startDay, 'touchstart', {
      changedTouches: [touchPoint],
    });
    fireTouchChangedEvent(startDay, 'touchmove', {
      changedTouches: [touchPoint],
    });
    fireTouchChangedEvent(startDay, 'touchend', {
      changedTouches: [touchPoint],
    });

    fireTouchChangedEvent(startDay, 'touchstart', {
      changedTouches: [touchPoint],
    });
    fireTouchChangedEvent(startDay, 'touchmove', {
      changedTouches: [touchPoint],
    });
    fireTouchChangedEvent(startDay, 'touchend', {
      changedTouches: [touchPoint],
    });

    expect(onChangeHandler.callCount).to.equal(2);

    expect(onChangeHandler.firstCall.args[0]).to.equal([
      adapterToUse.date(new Date(2022, 0, 17)),
      adapterToUse.date(new Date(2022, 0, 21)),
    ]);

    expect(onChangeHandler.secondCall.args[0]).to.equal([
      adapterToUse.date(new Date(2022, 0, 17)),
      adapterToUse.date(new Date(2022, 0, 17)),
    ]);

    const toolbarButtons = screen.getAllByMuiTest('toolbar-button');
    expect(toolbarButtons[0]).to.have.text('Jan 17');
    expect(toolbarButtons[1]).to.have.text('Jan 17');
  });
});
