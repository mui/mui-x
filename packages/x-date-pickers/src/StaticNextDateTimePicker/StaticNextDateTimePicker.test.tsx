import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { Unstable_StaticNextDateTimePicker as StaticNextDateTimePicker } from '@mui/x-date-pickers/StaticNextDateTimePicker';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { DateTimePickerTabs, DateTimePickerTabsProps } from '../DateTimePicker';

describe('<StaticNextDateTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
  });

  describeValidation(StaticNextDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'new-static-picker',
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

  it('should not render only toolbar when `showToolbar` is `false`', () => {
    render(<StaticNextDateTimePicker showToolbar={false} />);

    expect(screen.queryByMuiTest('picker-toolbar-title')).to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  describe('prop: displayStaticWrapperAs', () => {
    it('should render toolbar when `showToolbar` is `true`', () => {
      render(<StaticNextDateTimePicker displayStaticWrapperAs="desktop" showToolbar />);

      expect(screen.queryByMuiTest('picker-toolbar-title')).not.to.equal(null);
    });
  });

  describe('Components slots: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <StaticNextDateTimePicker
          componentsProps={{
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
          componentsProps={{
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
          components={{ Tabs: CustomPickerTabs }}
        />,
      );

      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
      expect(screen.getByText('test-custom-picker-tabs')).not.to.equal(null);
    });
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(<StaticNextDateTimePicker localeText={{ cancelButtonLabel: 'Custom cancel' }} />);

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
