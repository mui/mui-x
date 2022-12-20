import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { fireEvent, screen, userEvent } from '@mui/monorepo/test/utils';
import { Unstable_DesktopNextDateTimePicker as DesktopNextDateTimePicker } from '@mui/x-date-pickers/DesktopNextDateTimePicker';
import { adapterToUse, createPickerRenderer, openPicker } from 'test/utils/pickers-utils';

describe('<DesktopNextDateTimePicker />', () => {
  const { render } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T10:05:05.000'),
  });

  describe('Component slots: Popper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopNextDateTimePicker
          open
          componentsProps={{
            popper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'popper',
            },
          }}
          defaultValue={null}
        />,
      );
      const popper = screen.getByTestId('popper');

      fireEvent.click(popper);
      fireEvent.touchStart(popper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('Component slots: DesktopPaper', () => {
    it('should forward onClick and onTouchStart', () => {
      const handleClick = spy();
      const handleTouchStart = spy();
      render(
        <DesktopNextDateTimePicker
          open
          componentsProps={{
            desktopPaper: {
              onClick: handleClick,
              onTouchStart: handleTouchStart,
              // @ts-expect-error `data-*` attributes are not recognized in props objects
              'data-testid': 'paper',
            },
          }}
          defaultValue={null}
        />,
      );
      const paper = screen.getByTestId('paper');

      fireEvent.click(paper);
      fireEvent.touchStart(paper);

      expect(handleClick.callCount).to.equal(1);
      expect(handleTouchStart.callCount).to.equal(1);
    });
  });

  describe('picker state', () => {
    it('should open when clicking "Choose date"', () => {
      const onOpen = spy();

      render(<DesktopNextDateTimePicker onOpen={onOpen} defaultValue={null} />);

      userEvent.mousePress(screen.getByLabelText(/Choose date/));

      expect(onOpen.callCount).to.equal(1);
      expect(screen.queryByRole('dialog')).toBeVisible();
    });

    it('should call onAccept when selecting the same date and time after changing the year', () => {
      const onChange = spy();
      const onAccept = spy();
      const onClose = spy();

      render(
        <DesktopNextDateTimePicker
          onChange={onChange}
          onAccept={onAccept}
          onClose={onClose}
          defaultValue={adapterToUse.date(new Date(2018, 0, 1, 11, 53))}
          openTo="year"
        />,
      );

      openPicker({ type: 'date', variant: 'desktop' });

      // Select year
      userEvent.mousePress(screen.getByRole('button', { name: '2025' }));
      expect(onChange.callCount).to.equal(1);
      expect(onChange.lastCall.args[0]).toEqualDateTime(new Date(2025, 0, 1, 11, 53));
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(0);

      // Change the date (same value)
      userEvent.mousePress(screen.getByRole('gridcell', { name: '1' }));
      expect(onChange.callCount).to.equal(1); // Don't call onChange again since the value did not change
      expect(onAccept.callCount).to.equal(0);
      expect(onClose.callCount).to.equal(1);
    });
  });

  describe('localization', () => {
    it('should respect the `localeText` prop', () => {
      render(
        <DesktopNextDateTimePicker
          defaultValue={null}
          localeText={{ cancelButtonLabel: 'Custom cancel' }}
          componentsProps={{ actionBar: { actions: ['cancel'] } }}
        />,
      );
      openPicker({ type: 'date', variant: 'desktop' });

      expect(screen.queryByText('Custom cancel')).not.to.equal(null);
    });
  });
});
