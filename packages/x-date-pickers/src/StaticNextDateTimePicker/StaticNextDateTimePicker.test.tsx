import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { Unstable_StaticNextDateTimePicker as StaticNextDateTimePicker } from '@mui/x-date-pickers/StaticNextDateTimePicker';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { DateTimePickerTabs, DateTimePickerTabsProps } from '../NextDateTimePicker';

describe('<StaticNextDateTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
  });

  describeValidation(StaticNextDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'static-picker',
  }));

  it('should allow to select the same day and move to the next view', () => {
    const onChange = spy();
    render(
      <StaticNextDateTimePicker
        onChange={onChange}
        defaultValue={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    fireEvent.click(screen.getByRole('gridcell', { name: '1' }));
    expect(onChange.callCount).to.equal(0);

    expect(screen.getByLabelText(/Selected time/)).toBeVisible();
  });

  it('should render toolbar and tabs by default', () => {
    render(<StaticNextDateTimePicker />);

    expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  describe('prop: displayStaticWrapperAs', () => {
    describe('Component slots: Toolbar', () => {
      it('should render toolbar when `hidden` is `false`', () => {
        render(
          <StaticNextDateTimePicker
            displayStaticWrapperAs="desktop"
            componentsProps={{ toolbar: { hidden: false } }}
          />,
        );

        expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
      });
    });
  });

  describe('Components slots: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <StaticNextDateTimePicker
          slotProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });

    it('should render tabs when `hidden` is `false`', () => {
      render(
        <StaticNextDateTimePicker
          displayStaticWrapperAs="desktop"
          slotProps={{
            tabs: { hidden: false },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).to.equal(null);
      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });

    it('should render custom component', () => {
      function CustomPickerTabs(props: DateTimePickerTabsProps) {
        return (
          <React.Fragment>
            <DateTimePickerTabs {...props} />
            <span>test-custom-picker-tabs</span>
          </React.Fragment>
        );
      }
      render(
        <StaticNextDateTimePicker
          displayStaticWrapperAs="mobile"
          slots={{ tabs: CustomPickerTabs }}
        />,
      );

      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
      expect(screen.getByText('test-custom-picker-tabs')).not.to.equal(null);
    });
  });

  describe('Slots: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <StaticNextDateTimePicker
          slotProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });

    it('should render tabs when `hidden` is `false`', () => {
      render(
        <StaticNextDateTimePicker
          displayStaticWrapperAs="desktop"
          slotProps={{
            tabs: { hidden: false },
          }}
        />,
      );

      expect(screen.queryByMuiTest('picker-toolbar-title')).to.equal(null);
      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });

    it('should render custom component', () => {
      function CustomPickerTabs(props: DateTimePickerTabsProps) {
        return (
          <React.Fragment>
            <DateTimePickerTabs {...props} />
            <span>test-custom-picker-tabs</span>
          </React.Fragment>
        );
      }
      render(
        <StaticNextDateTimePicker
          displayStaticWrapperAs="mobile"
          slots={{ tabs: CustomPickerTabs }}
        />,
      );

      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
      expect(screen.getByText('test-custom-picker-tabs')).not.to.equal(null);
    });
  });

  describe('Component slots: Toolbar', () => {
    it('should not render only toolbar when `hidden` is `true`', () => {
      render(<StaticNextDateTimePicker componentsProps={{ toolbar: { hidden: true } }} />);
    });
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<StaticNextDateTimePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
