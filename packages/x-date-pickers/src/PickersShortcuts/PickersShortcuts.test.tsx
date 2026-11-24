import { createTheme, ThemeProvider } from '@mui/material/styles';
import { StaticDatePicker } from '@mui/x-date-pickers/StaticDatePicker';
import { pickersLayoutClasses } from '@mui/x-date-pickers/PickersLayout';
import { adapterToUse, createPickerRenderer } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe.skipIf(isJSDOM)('<PickersShortcuts /> - theme.focusVisible', () => {
  const { render } = createPickerRenderer();

  const shortcutsSlotProps = {
    shortcuts: { items: [{ label: 'Today', getValue: () => adapterToUse.date() }] },
  };

  it('reserves room for the ring when a focused chip scrolls to the edge of the list', () => {
    render(
      <ThemeProvider theme={createTheme({ focusVisible: true })}>
        <StaticDatePicker slotProps={shortcutsSlotProps} />
      </ThemeProvider>,
    );

    const shortcuts = document.querySelector(`.${pickersLayoutClasses.shortcuts}`)!;
    expect(shortcuts).to.have.style('scroll-padding-top', '4px');
    expect(shortcuts).to.have.style('scroll-padding-bottom', '4px');
  });

  it('keeps the default scroll padding without the option', () => {
    render(<StaticDatePicker slotProps={shortcutsSlotProps} />);

    const shortcuts = document.querySelector(`.${pickersLayoutClasses.shortcuts}`)!;
    expect(shortcuts).to.have.style('scroll-padding-top', 'auto');
  });
});
