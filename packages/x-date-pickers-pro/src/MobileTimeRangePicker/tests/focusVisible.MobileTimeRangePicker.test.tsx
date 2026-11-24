import { act } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { MobileTimeRangePicker } from '@mui/x-date-pickers-pro/MobileTimeRangePicker';
import { timeRangePickerToolbarClasses } from '@mui/x-date-pickers-pro/TimeRangePicker';
import { createPickerRenderer } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe.skipIf(isJSDOM)('<MobileTimeRangePicker /> - theme.focusVisible', () => {
  const { render } = createPickerRenderer();

  it('draws the ring inside the toolbar buttons so the dialog does not clip it', async () => {
    const { user } = render(
      <ThemeProvider
        theme={createTheme({
          focusVisible: true,
          components: { MuiButtonBase: { defaultProps: { disableRipple: true } } },
        })}
      >
        <MobileTimeRangePicker open />
      </ThemeProvider>,
    );

    const toolbar = document.querySelector(`.${timeRangePickerToolbarClasses.root}`)!;
    const toolbarButtons = Array.from(toolbar.querySelectorAll('button'));
    await user.keyboard('{Tab}');
    act(() => toolbarButtons[0].focus());

    expect(toolbarButtons[0]).to.have.style('outline-style', 'solid');
    expect(toolbarButtons[0]).to.have.style('outline-offset', '-2px');
  });
});
