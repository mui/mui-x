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

describe('<YearPicker />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <YearPicker
      minDate={adapterToUse.date(new Date(2019, 0, 1))}
      maxDate={adapterToUse.date(new Date(2029, 0, 1))}
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
        minDate={adapterToUse.date(new Date(2019, 0, 1))}
        maxDate={adapterToUse.date(new Date(2029, 0, 1))}
        date={adapterToUse.date(new Date(2019, 1, 2))}
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
    expect(onChangeMock.args[0][0]).toEqualDateTime(new Date(2025, 1, 2));
  });

  it('does not allow to pick year if readOnly prop is passed', () => {
    const onChangeMock = spy();
    render(
      <YearPicker
        minDate={adapterToUse.date(new Date(2019, 0, 1))}
        maxDate={adapterToUse.date(new Date(2029, 0, 1))}
        date={adapterToUse.date(new Date(2019, 1, 2))}
        onChange={onChangeMock}
        readOnly
      />,
    );
    const targetYear = screen.getByRole('button', { name: '2025' });
    expect(targetYear.tagName).to.equal('BUTTON');

    fireEvent.click(targetYear);

    expect(onChangeMock.callCount).to.equal(0);
  });

  describe('Disabled', () => {
    it('should disable all years if props.disabled = true', () => {
      const onChange = spy();
      render(
        <YearPicker date={adapterToUse.date(new Date(2017, 1, 15))} onChange={onChange} disabled />,
      );

      screen.getAllByRole('button').forEach((monthButton) => {
        expect(monthButton).to.have.attribute('disabled');
        fireEvent.click(monthButton);
        expect(onChange.callCount).to.equal(0);
      });
    });

    it('should not render years before props.minDate but should render and not disable the year in which props.minDate is', () => {
      const onChange = spy();
      render(
        <YearPicker
          date={adapterToUse.date(new Date(2017, 1, 15))}
          onChange={onChange}
          minDate={adapterToUse.date(new Date(2018, 1, 12))}
        />,
      );

      const year2017 = screen.queryByText('2017', { selector: 'button' });
      const year2018 = screen.getByText('2018', { selector: 'button' });

      expect(year2017).to.equal(null);
      expect(year2018).not.to.have.attribute('disabled');

      fireEvent.click(year2018);
      expect(onChange.callCount).to.equal(1);
    });

    it('should not render years after props.maxDate but should render and not disable the year in which props.maxDate is', () => {
      const onChange = spy();
      render(
        <YearPicker
          date={adapterToUse.date(new Date(2019, 1, 15))}
          onChange={onChange}
          maxDate={adapterToUse.date(new Date(2025, 3, 12))}
        />,
      );

      const year2026 = screen.queryByText('2026', { selector: 'button' });
      const year2025 = screen.getByText('2025', { selector: 'button' });

      expect(year2026).to.equal(null);
      expect(year2025).not.to.have.attribute('disabled');

      fireEvent.click(year2025);
      expect(onChange.callCount).to.equal(1);
    });

    it('should disable years if props.shouldDisableYear returns true', () => {
      const onChange = spy();
      render(
        <YearPicker
          date={adapterToUse.date(new Date(2019, 0, 2))}
          onChange={onChange}
          shouldDisableYear={(month) => adapterToUse.getYear(month) === 2024}
        />,
      );

      const year2024 = screen.getByText('2024', { selector: 'button' });
      const year2025 = screen.getByText('2025', { selector: 'button' });

      expect(year2024).to.have.attribute('disabled');
      expect(year2025).not.to.have.attribute('disabled');

      fireEvent.click(year2024);
      expect(onChange.callCount).to.equal(0);

      fireEvent.click(year2025);
      expect(onChange.callCount).to.equal(1);
    });
  });

  it('should allows to focus years when it contains valid date', () => {
    render(
      <YearPicker
        minDate={adapterToUse.date(new Date(2018, 10, 1))}
        maxDate={adapterToUse.date(new Date(2020, 3, 1))}
        // date is chose such as replacing year by 2018 or 2020 makes it out of valid range
        date={adapterToUse.date(new Date(2019, 7, 1))}
        onChange={() => {}}
        autoFocus // needed to allow keyboard navigation
      />,
    );

    const button2019 = screen.getByRole('button', { name: '2019' });

    button2019.focus();
    fireEvent.keyDown(button2019, { key: 'ArrowLeft' });
    expect(document.activeElement).to.have.text('2018');

    button2019.focus();
    fireEvent.keyDown(button2019, { key: 'ArrowRight' });
    expect(document.activeElement).to.have.text('2020');
  });
});
