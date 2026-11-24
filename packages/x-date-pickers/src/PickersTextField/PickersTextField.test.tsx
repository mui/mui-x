import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { DateField } from '@mui/x-date-pickers/DateField';
import type { DateFieldProps } from '@mui/x-date-pickers/DateField';
import {
  PickersInputBase,
  PickersTextField,
  pickersInputBaseClasses,
  pickersTextFieldClasses,
} from '@mui/x-date-pickers/PickersTextField';
import { createPickerRenderer, PICKERS_TEXT_FIELD_STUB_PROPS } from 'test/utils/pickers';
import { isJSDOM } from 'test/utils/skipIf';
import { describe, it, expect } from 'vitest';

describe('<PickersTextField /> - slot forwarding', () => {
  const { render } = createPickerRenderer();

  it('should forward `slotProps.htmlInput` to the underlying <input>', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        slotProps={{ htmlInput: { 'data-testid': 'html-input' } }}
      />,
    );

    expect(screen.getByTestId('html-input')).not.to.equal(null);
  });

  it('should merge `slotProps.input.slotProps.sectionContent` onto each section content element', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        slotProps={{
          input: {
            slotProps: {
              sectionContent: { 'data-testid': 'picker-section-content' },
            },
          },
        }}
      />,
    );

    const nodes = screen.getAllByTestId('picker-section-content');
    expect(nodes.length).to.be.greaterThan(0);
    nodes.forEach((node) => {
      expect(node.className).to.include('MuiPickersInputBase-sectionContent');
    });
  });

  it('should resolve a callback `slotProps.input.slotProps.sectionContent` and merge the result onto each section content element', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        slotProps={{
          input: {
            slotProps: {
              sectionContent: () => ({
                'data-testid': 'picker-section-content-fn',
                className: 'custom-section-content',
              }),
            },
          },
        }}
      />,
    );

    const nodes = screen.getAllByTestId('picker-section-content-fn');
    expect(nodes.length).to.be.greaterThan(0);
    nodes.forEach((node) => {
      expect(node.className).to.include('MuiPickersInputBase-sectionContent');
      expect(node.className).to.include('custom-section-content');
    });
  });

  it('should forward `slotProps.inputLabel` to the label element', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        label="My label"
        slotProps={{ inputLabel: { 'data-testid': 'input-label' } }}
      />,
    );

    expect(screen.getByTestId('input-label')).to.have.text('My label');
  });

  it('should forward `slotProps.formHelperText` to the helper text element', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        helperText="Helper"
        slotProps={{ formHelperText: { 'data-testid': 'helper-text' } }}
      />,
    );

    expect(screen.getByTestId('helper-text')).to.have.text('Helper');
  });

  it('should render a custom `slots.formHelperText`', () => {
    const CustomHelperText = React.forwardRef<HTMLDivElement, any>((props, ref) => (
      <div ref={ref} data-testid="custom-helper" {...props} />
    ));
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        helperText="Helper"
        slots={{ formHelperText: CustomHelperText }}
      />,
    );

    expect(screen.getByTestId('custom-helper')).to.have.text('Helper');
  });
});

describe('<PickersTextField /> - readOnly', () => {
  const { render } = createPickerRenderer();

  it('should make the input read-only when `readOnly` is passed', () => {
    render(<PickersTextField {...PICKERS_TEXT_FIELD_STUB_PROPS} readOnly />);

    expect(document.querySelector('input')).to.have.property('readOnly', true);
    expect(document.querySelector(`.${pickersInputBaseClasses.root}`)).to.have.class(
      pickersInputBaseClasses.readOnly,
    );
    expect(document.querySelector(`.${pickersTextFieldClasses.root}`)).not.to.have.attribute(
      'readonly',
    );
  });

  it('should let `slotProps.input.readOnly` override `readOnly`', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        readOnly
        slotProps={{ input: { readOnly: false } }}
      />,
    );

    expect(document.querySelector('input')).to.have.property('readOnly', false);
    expect(document.querySelector(`.${pickersInputBaseClasses.root}`)).not.to.have.class(
      pickersInputBaseClasses.readOnly,
    );
  });
});

describe('<PickersTextField /> - outlined notch', () => {
  const { render } = createPickerRenderer();

  // The collapsed legend keeps a fixed `0.01px` max-width, while the notched legend expands.
  const COLLAPSED_LEGEND_MAX_WIDTH = '0.01px';

  it('should notch the outline when the field is filled and `notched` is not set', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        areAllSectionsEmpty={false}
        label="My label"
      />,
    );

    const legend = document.querySelector('legend')!;
    expect(window.getComputedStyle(legend).maxWidth).not.to.equal(COLLAPSED_LEGEND_MAX_WIDTH);
  });

  it('should remove the notch when `notched={false}` is passed, even when the field is filled', () => {
    render(
      <PickersTextField
        {...PICKERS_TEXT_FIELD_STUB_PROPS}
        areAllSectionsEmpty={false}
        label="My label"
        slotProps={{ input: { notched: false } }}
      />,
    );

    const legend = document.querySelector('legend')!;
    expect(window.getComputedStyle(legend).maxWidth).to.equal(COLLAPSED_LEGEND_MAX_WIDTH);
  });
});

describe('pickersInputBaseClasses', () => {
  it('should expose the `sectionsContainer` and `readOnly` class keys declared in its interface', () => {
    expect(pickersInputBaseClasses.sectionsContainer).to.equal(
      'MuiPickersInputBase-sectionsContainer',
    );
    // `readOnly` is a global state class.
    expect(pickersInputBaseClasses.readOnly).to.equal('Mui-readOnly');
  });
});

describe('<PickersTextField /> - format placeholder opacity', () => {
  const { render } = createPickerRenderer();

  const getSectionsOpacity = (root: ParentNode) =>
    Array.from(root.querySelectorAll(`.${pickersInputBaseClasses.sectionsContainer}`)).map(
      (el) => window.getComputedStyle(el).opacity,
    );

  it('should dim the format placeholder of an empty field with a start adornment, matching a field without one', () => {
    const { container } = render(
      <div>
        <PickersTextField {...PICKERS_TEXT_FIELD_STUB_PROPS} />
        <PickersTextField
          {...PICKERS_TEXT_FIELD_STUB_PROPS}
          slotProps={{ input: { startAdornment: <span>@</span> } }}
        />
      </div>,
    );

    const [reference, adorned] = getSectionsOpacity(container);
    // The plain empty field renders its format as a dimmed placeholder, neither hidden nor full text.
    expect(reference).not.to.equal('0');
    expect(reference).not.to.equal('1');
    // A start adornment must not promote the placeholder to full-strength text.
    expect(adorned).to.equal(reference);
  });

  it('should dim the format placeholder of an empty labelled field with a start adornment', () => {
    const { container } = render(
      <div>
        <PickersTextField {...PICKERS_TEXT_FIELD_STUB_PROPS} />
        <PickersTextField
          {...PICKERS_TEXT_FIELD_STUB_PROPS}
          label="My label"
          slotProps={{ input: { startAdornment: <span>@</span> } }}
        />
      </div>,
    );

    const [reference, adorned] = getSectionsOpacity(container);
    expect(reference).not.to.equal('0');
    expect(reference).not.to.equal('1');
    expect(adorned).to.equal(reference);
  });

  it('should keep hiding the format placeholder of an empty labelled field without a start adornment', () => {
    const { container } = render(
      <PickersTextField {...PICKERS_TEXT_FIELD_STUB_PROPS} label="My label" />,
    );

    const [opacity] = getSectionsOpacity(container);
    expect(opacity).to.equal('0');
  });
});

describe.skipIf(isJSDOM)('<PickersTextField /> - theme.focusVisible', () => {
  const { render } = createPickerRenderer();

  const renderField = (props: DateFieldProps) =>
    render(
      <ThemeProvider theme={createTheme({ focusVisible: true })}>
        <DateField {...props} />
      </ThemeProvider>,
    );

  const getFocusedRoot = () => {
    const root = document.querySelector<HTMLElement>(`.${pickersInputBaseClasses.root}`)!;
    expect(root).to.have.class(pickersInputBaseClasses.focused);
    return root;
  };

  it('draws an inset ring on a standard field without an underline', async () => {
    const { user } = renderField({
      variant: 'standard',
      slotProps: { textField: { slotProps: { input: { disableUnderline: true } } } },
    });

    await user.keyboard('{Tab}');

    const root = getFocusedRoot();
    expect(root).to.have.style('outline-style', 'solid');
    expect(root).to.have.style('outline-offset', '-2px');
    expect(root).to.have.style('padding-left', '4px');
  });

  it('draws an outset ring on a filled field without an underline', async () => {
    const { user } = renderField({
      variant: 'filled',
      slotProps: { textField: { slotProps: { input: { disableUnderline: true } } } },
    });

    await user.keyboard('{Tab}');

    const root = getFocusedRoot();
    expect(root).to.have.style('outline-style', 'solid');
    expect(root).to.have.style('outline-offset', '2px');
  });

  it('draws an outset ring on a bare input', async () => {
    const { user } = renderField({
      slotProps: { textField: { slots: { input: PickersInputBase } } },
    });

    await user.keyboard('{Tab}');

    const root = getFocusedRoot();
    expect(root).to.have.style('outline-style', 'solid');
    expect(root).to.have.style('outline-offset', '2px');
  });

  it('keeps the underline as the only focus cue on a standard field', async () => {
    const { user } = renderField({ variant: 'standard' });

    await user.keyboard('{Tab}');

    expect(getFocusedRoot()).to.have.style('outline-style', 'none');
  });

  it('keeps the outline border as the only focus cue on an outlined field', async () => {
    const { user } = renderField({});

    await user.keyboard('{Tab}');

    expect(getFocusedRoot()).to.have.style('outline-style', 'none');
  });
});
