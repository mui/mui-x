import { page } from '@vitest/browser/context';
import * as React from 'react';
import { describe, expect, it } from 'vitest';
import { TransitionProps } from '@mui/material/transitions';
import { spy } from 'sinon';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import { createPickerRenderer, adapterToUse } from 'test/utils/pickers';
import { act } from '@mui/internal-test-utils';

// Alternative on how we could write browser tests

describe('DesktopDatePicker (browser)', () => {
  const { render } = createPickerRenderer();

  const NoTransition = React.forwardRef(function NoTransition(
    props: TransitionProps & { children?: React.ReactNode },
    ref: React.Ref<HTMLDivElement>,
  ) {
    const { children, in: inProp } = props;

    if (!inProp) {
      return null;
    }
    return (
      <div ref={ref} tabIndex={-1}>
        {children}
      </div>
    );
  });

  let originalScrollX: number;
  let originalScrollY: number;

  beforeEach(() => {
    originalScrollX = window.screenX;
    originalScrollY = window.scrollY;
  });

  afterEach(() => {
    window.scrollTo?.(originalScrollX, originalScrollY);
  });

  it('does not scroll when opened', async () => {
    const handleClose = spy();
    const handleOpen = spy();
    function BottomAnchoredDesktopTimePicker() {
      const [anchorEl, anchorElRef] = React.useState<HTMLElement | null>(null);

      React.useEffect(() => {
        if (anchorEl !== null) {
          window.scrollTo(0, anchorEl.getBoundingClientRect().top);
        }
      }, [anchorEl]);

      return (
        <React.Fragment>
          <div style={{ height: '200vh' }}>Spacer</div>
          <DesktopDatePicker
            defaultValue={adapterToUse.date('2018-01-01')}
            onClose={handleClose}
            onOpen={handleOpen}
            slots={{
              desktopTransition: NoTransition,
            }}
            slotProps={{
              openPickerButton: {
                ref: anchorElRef,
              },
            }}
          />
        </React.Fragment>
      );
    }
    render(<BottomAnchoredDesktopTimePicker />);
    const scrollYBeforeOpen = window.scrollY;

    await expect.element(page.getByRole('button', { name: /choose date/i })).toBeInTheDocument();

    await act(async () => {
      await page.getByRole('button', { name: /choose date/i }).click({
        timeout: 10000,
      });
    });

    expect(handleClose.callCount).to.equal(0);
    expect(handleOpen.callCount).to.equal(1);
    expect(window.scrollY, 'focus caused scroll').to.equal(scrollYBeforeOpen);
  });
});
