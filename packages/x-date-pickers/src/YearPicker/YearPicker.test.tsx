import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen, describeConformance } from '@mui/monorepo/test/utils';
import { YearPicker, yearPickerClasses as classes } from '@mui/x-date-pickers/YearPicker';
import {
  adapterToUse,
  wrapPickerMount,
  createPickerRenderer,
} from '../../../../test/utils/pickers-utils';
import {MonthPicker} from "@mui/x-date-pickers";

describe('<YearPicker />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <YearPicker
      minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
      maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
      date={adapterToUse.date()}
      onChange={() => {}}
    />,
    () => ({
      classes,
      inheritComponent: 'div',
      wrapMount: wrapPickerMount,
      render,
      muiName: 'MuiYearPicker',
      refInstanceof: window.HTMLDivElement,
      // cannot test reactTestRenderer because of required context
      skip: [
        'componentProp',
        'componentsProp',
        'propsSpread',
        'reactTestRenderer',
        'themeDefaultProps',
        'themeVariants',
      ],
    }),
  );

  it('allows to pick year standalone by click, `Enter` and `Space`', () => {
    const onChangeMock = spy();
    render(
      <YearPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
      />,
    );
    const targetYear = screen.getByRole('button', { name: '2025' });

    // A native button implies Enter and Space keydown behavior
    // These keydown events only trigger click behavior if they're trusted (programmatically dispatched events aren't trusted).
    // If this breaks, make sure to add tests for
    // - fireEvent.keyDown(targetDay, { key: 'Enter' })
    // - fireEvent.keyUp(targetDay, { key: 'Space' })
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChangeMock.callCount).to.equal(1);
    expect(onChangeMock.args[0][0]).toEqualDateTime(adapterToUse.date('2025-02-02T00:00:00.000'));
  });

  it('does not allow to pick year if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <YearPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
        readOnly
      />,
    );
    const targetYear = screen.getByRole('button', { name: '2025' });
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChangeMock.callCount).to.equal(0);
  });

  describe.only('Disabled', () => {
    it.only('should disable all years if props.disabled = true', () => {
      const handleChange = spy();
      render(
          <MonthPicker
              date={adapterToUse.date('2019-02-15T00:00:00.000')}
              onChange={handleChange}
              disabled
          />,
      );

      screen.getAllByRole('button').forEach(monthButton => {
        expect(monthButton).to.have.attribute('disabled');
        fireEvent.click(monthButton);
        expect(handleChange.callCount).to.equal(0);
      })
    })

    it('should disable years before props.minDate but not the year in which props.minDate is', () => {
      const handleChange = spy();
      render(
          <MonthPicker
              date={adapterToUse.date('2019-02-15T00:00:00.000')}
              onChange={handleChange}
              minDate={adapterToUse.date('2018-02-12T00:00:00.000')}
          />,
      );

      const year2017 = screen.getByText('Jan', { selector: 'button' })
      const year2018 = screen.getByText('Feb', { selector: 'button' })

      expect(year2017).to.have.attribute('disabled');
      expect(year2018).not.to.have.attribute('disabled');

      fireEvent.click(year2017);
      expect(handleChange.callCount).to.equal(0);

      fireEvent.click(year2018);
      expect(handleChange.callCount).to.equal(1);
    })

    it('should disable months after props.maxDate but not the month in which props.maxDate is', () => {
      const handleChange = spy();
      render(
          <MonthPicker
              date={adapterToUse.date('2019-02-15T00:00:00.000')}
              onChange={handleChange}
              maxDate={adapterToUse.date('2019-04-12T00:00:00.000')}
          />,
      );

      const may = screen.getByText('May', { selector: 'button' })
      const april = screen.getByText('Apr', { selector: 'button' })

      expect(may).to.have.attribute('disabled');
      expect(april).not.to.have.attribute('disabled');

      fireEvent.click(may);
      expect(handleChange.callCount).to.equal(0);

      fireEvent.click(april);
      expect(handleChange.callCount).to.equal(1);
    })

    it('should disable months if props.shouldDisableMonth returns false', () => {
      const handleChange = spy();
      render(
          <MonthPicker
              date={adapterToUse.date('2019-02-02T00:00:00.000')}
              onChange={handleChange}
              shouldDisableMonth={(month) => adapterToUse.getMonth(month) === 3}
          />,
      );

      const april = screen.getByText('Apr', { selector: 'button' })
      const jun = screen.getByText('Jun', { selector: 'button' })

      expect(april).to.have.attribute('disabled');
      expect(jun).not.to.have.attribute('disabled');

      fireEvent.click(april);
      expect(handleChange.callCount).to.equal(0);

      fireEvent.click(jun);
      expect(handleChange.callCount).to.equal(1);
    });
  })
});
