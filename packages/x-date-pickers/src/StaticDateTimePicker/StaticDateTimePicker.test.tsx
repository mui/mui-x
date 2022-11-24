import * as React from 'react';
import TextField from '@mui/material/TextField';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { adapterToUse, createPickerRenderer, withPickerControls } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';
import { DateTimePickerTabs, DateTimePickerTabsProps } from '../DateTimePicker';

const WrappedStaticDateTimePicker = withPickerControls(StaticDateTimePicker)({
  renderInput: (params) => <TextField {...params} />,
});

describe('<StaticDateTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
  });

  describeValidation(StaticDateTimePicker, () => ({
    render,
    clock,
    views: ['year', 'month', 'day', 'hours', 'minutes'],
    componentFamily: 'legacy-static-picker',
  }));
  it('should allow to select the same day and move to the next view', () => {
    const onChangeMock = spy();
    render(
      <StaticDateTimePicker
        onChange={onChangeMock}
        renderInput={(params) => <TextField {...params} />}
        value={adapterToUse.date(new Date(2018, 0, 1))}
      />,
    );

    fireEvent.click(screen.getByRole('gridcell', { name: '1' }));
    expect(onChangeMock.callCount).to.equal(0);

    expect(screen.getByLabelText(/Selected time/)).toBeVisible();
  });

  it('should render toolbar and tabs by default', () => {
    render(
      <StaticDateTimePicker
        onChange={() => {}}
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByRole('button', { name: /go to text input view/i })).not.to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  it('should not render only toolbar when `showToolbar` is `false`', () => {
    render(
      <StaticDateTimePicker
        showToolbar={false}
        onChange={() => {}}
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.queryByRole('button', { name: /go to text input view/i })).to.equal(null);
    expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
  });

  describe('prop: displayStaticWrapperAs', () => {
    it('should not render toolbar and tabs by default', () => {
      render(
        <StaticDateTimePicker
          displayStaticWrapperAs="desktop"
          onChange={() => {}}
          value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
          renderInput={(params) => <TextField {...params} />}
        />,
      );

      expect(screen.queryByRole('button', { name: /go to text input view/i })).to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });

    it('should render toolbar when `showToolbar` is `true`', () => {
      render(
        <StaticDateTimePicker
          displayStaticWrapperAs="desktop"
          showToolbar
          onChange={() => {}}
          value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
          renderInput={(params) => <TextField {...params} />}
        />,
      );

      expect(screen.getByRole('button', { name: /go to text input view/i })).not.to.equal(null);
    });
  });

  describe('Components slots: Tabs', () => {
    it('should not render tabs when `hidden` is `true`', () => {
      render(
        <WrappedStaticDateTimePicker
          componentsProps={{
            tabs: { hidden: true },
          }}
        />,
      );

      expect(screen.getByRole('button', { name: /go to text input view/i })).not.to.equal(null);
      expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
    });

    it('should render tabs when `hidden` is `false`', () => {
      render(
        <WrappedStaticDateTimePicker
          displayStaticWrapperAs="desktop"
          componentsProps={{
            tabs: { hidden: false },
          }}
        />,
      );

      expect(screen.queryByRole('button', { name: /go to text input view/i })).to.equal(null);
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
        <StaticDateTimePicker
          displayStaticWrapperAs="mobile"
          onChange={() => {}}
          value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
          renderInput={(params) => <TextField {...params} />}
          components={{ Tabs: CustomPickerTabs }}
        />,
      );

      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
      expect(screen.getByText('test-custom-picker-tabs')).not.to.equal(null);
    });
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(
        <WrappedStaticDateTimePicker
          initialValue={null}
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
        />,
      );

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
