import * as React from 'react';
import { spy } from 'sinon';
import { expect } from 'chai';
import { fireEvent, screen, describeConformance } from '@mui/monorepo/test/utils';
import { MonthPicker, monthPickerClasses as classes } from '@mui/x-date-pickers/MonthPicker';
import {
  adapterToUse,
  wrapPickerMount,
  createPickerRenderer,
} from '../../../../test/utils/pickers-utils';

describe('<MonthPicker />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <MonthPicker
      minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
      maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
      date={adapterToUse.date()}
      onChange={() => {}}
    />,
    () => ({
      classes,
      inheritComponent: 'div',
      render,
      wrapMount: wrapPickerMount,
      muiName: 'MuiMonthPicker',
      refInstanceof: window.HTMLDivElement,
      // cannot test reactTestRenderer because of required context
      skip: [
        'componentProp',
        'componentsProp',
        'propsSpread',
        'reactTestRenderer',
        'themeVariants',
      ],
    }),
  );

  it('allows to pick month standalone', () => {
    const onChangeMock = spy();
    render(
      <MonthPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
      />,
    );

    fireEvent.click(screen.getByText('May', { selector: 'button' }));
    expect((onChangeMock.args[0][0] as Date).getMonth()).to.equal(4); // month index starting from 0
  });

  it('does not allow to pick months if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <MonthPicker
        minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
        maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
        date={adapterToUse.date('2019-02-02T00:00:00.000')}
        onChange={onChangeMock}
        readOnly
      />,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Apr', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);

    fireEvent.click(screen.getByText('Jul', { selector: 'button' }));
    expect(onChangeMock.callCount).to.equal(0);
  });

  it('clicking on a PickersMonth button should not trigger the form submit', () => {
    const onSubmitMock = spy();
    render(
      <form onSubmit={onSubmitMock}>
        <MonthPicker
          minDate={adapterToUse.date('2019-01-01T00:00:00.000')}
          maxDate={adapterToUse.date('2029-01-01T00:00:00.000')}
          date={adapterToUse.date('2019-02-02T00:00:00.000')}
          onChange={() => {}}
        />
      </form>,
    );

    fireEvent.click(screen.getByText('Mar', { selector: 'button' }));
    expect(onSubmitMock.callCount).to.equal(0);
  });

  describe('Disabled', () => {
    it('should disable all months if props.disabled = true', () => {
      const onChange = spy();
      render(
        <MonthPicker
          date={adapterToUse.date('2019-02-15T00:00:00.000')}
          onChange={onChange}
          disabled
        />,
      );

      screen.getAllByRole('button').forEach((monthButton) => {
        expect(monthButton).to.have.attribute('disabled');
        fireEvent.click(monthButton);
        expect(onChange.callCount).to.equal(0);
      });
    });

    it('should disable months before props.minDate but not the month in which props.minDate is', () => {
      const onChange = spy();
      render(
        <MonthPicker
          date={adapterToUse.date('2019-02-15T00:00:00.000')}
          onChange={onChange}
          minDate={adapterToUse.date('2019-02-12T00:00:00.000')}
        />,
      );

      const january = screen.getByText('Jan', { selector: 'button' });
      const february = screen.getByText('Feb', { selector: 'button' });

      expect(january).to.have.attribute('disabled');
      expect(february).not.to.have.attribute('disabled');

      fireEvent.click(january);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(february);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable months after props.maxDate but not the month in which props.maxDate is', () => {
      const onChange = spy();
      render(
        <MonthPicker
          date={adapterToUse.date('2019-02-15T00:00:00.000')}
          onChange={onChange}
          maxDate={adapterToUse.date('2019-04-12T00:00:00.000')}
        />,
      );

      const may = screen.getByText('May', { selector: 'button' });
      const april = screen.getByText('Apr', { selector: 'button' });

      expect(may).to.have.attribute('disabled');
      expect(april).not.to.have.attribute('disabled');

      fireEvent.click(may);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(april);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable months if props.shouldDisableMonth returns true', () => {
      const onChange = spy();
      render(
        <MonthPicker
          date={adapterToUse.date('2019-02-02T00:00:00.000')}
          onChange={onChange}
          shouldDisableMonth={(month) => adapterToUse.getMonth(month) === 3}
        />,
      );

      const april = screen.getByText('Apr', { selector: 'button' });
      const jun = screen.getByText('Jun', { selector: 'button' });

      expect(april).to.have.attribute('disabled');
      expect(jun).not.to.have.attribute('disabled');

      fireEvent.click(april);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(jun);
      expect(onChange.callCount).to.equal(1);
    });
  });
});
