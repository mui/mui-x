import * as React from 'react';
import TextField from '@mui/material/TextField';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen } from '@mui/monorepo/test/utils';
import { StaticDateTimePicker } from '@mui/x-date-pickers/StaticDateTimePicker';
import { adapterToUse, createPickerRenderer } from '../../../../test/utils/pickers-utils';

describe('<StaticDateTimePicker />', () => {
  const { render } = createPickerRenderer({ clock: 'fake' });

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

  it('should not render tabs when `hideTabs` is `true`', () => {
    render(
      <StaticDateTimePicker
        hideTabs
        onChange={() => {}}
        value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
        renderInput={(params) => <TextField {...params} />}
      />,
    );

    expect(screen.getByRole('button', { name: /go to text input view/i })).not.to.equal(null);
    expect(screen.queryByRole('tab', { name: 'pick date' })).to.equal(null);
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

    it('should render tabs when `hideTabs` is `false`', () => {
      render(
        <StaticDateTimePicker
          displayStaticWrapperAs="desktop"
          hideTabs={false}
          onChange={() => {}}
          value={adapterToUse.date(new Date(2021, 10, 20, 10, 1, 22))}
          renderInput={(params) => <TextField {...params} />}
        />,
      );

      expect(screen.queryByRole('button', { name: /go to text input view/i })).to.equal(null);
      expect(screen.getByRole('tab', { name: 'pick date' })).not.to.equal(null);
    });
  });
});
