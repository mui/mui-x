import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import { createPickerRenderer } from 'test/utils/pickers';

const STUB_PROPS = {
  areAllSectionsEmpty: true,
  contentEditable: false,
  elements: [
    {
      after: { children: null },
      before: { children: null },
      container: { children: null },
      content: { children: null, 'data-range-position': 'start' },
    },
  ],
} as any;

describe('<PickersTextField /> - slot forwarding', () => {
  const { render } = createPickerRenderer();

  it('should forward `slotProps.htmlInput` to the underlying <input>', () => {
    render(
      <PickersTextField
        {...STUB_PROPS}
        slotProps={{ htmlInput: { 'data-testid': 'html-input' } as any }}
      />,
    );

    expect(screen.getByTestId('html-input')).not.to.equal(null);
  });

  it('should forward the `autoComplete` prop to the underlying <input>', () => {
    render(<PickersTextField {...STUB_PROPS} autoComplete="bday" />);

    expect(document.querySelector('input')).to.have.attribute('autocomplete', 'bday');
  });

  it('should let `slotProps.htmlInput.autoComplete` override the `autoComplete` prop', () => {
    render(
      <PickersTextField
        {...STUB_PROPS}
        autoComplete="bday"
        slotProps={{ htmlInput: { autoComplete: 'off' } as any }}
      />,
    );

    expect(document.querySelector('input')).to.have.attribute('autocomplete', 'off');
  });

  it('should merge `slotProps.input.slotProps.sectionContent` onto each section content element', () => {
    render(
      <PickersTextField
        {...STUB_PROPS}
        slotProps={{
          input: {
            slotProps: {
              sectionContent: { 'data-testid': 'picker-section-content' } as any,
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
        {...STUB_PROPS}
        slotProps={{
          input: {
            slotProps: {
              sectionContent: (() => ({
                'data-testid': 'picker-section-content-fn',
                className: 'custom-section-content',
              })) as any,
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
        {...STUB_PROPS}
        label="My label"
        slotProps={{ inputLabel: { 'data-testid': 'input-label' } as any }}
      />,
    );

    expect(screen.getByTestId('input-label')).to.have.text('My label');
  });

  it('should forward `slotProps.formHelperText` to the helper text element', () => {
    render(
      <PickersTextField
        {...STUB_PROPS}
        helperText="Helper"
        slotProps={{ formHelperText: { 'data-testid': 'helper-text' } as any }}
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
        {...STUB_PROPS}
        helperText="Helper"
        slots={{ formHelperText: CustomHelperText }}
      />,
    );

    expect(screen.getByTestId('custom-helper')).to.have.text('Helper');
  });
});

describe('<PickersTextField /> - outlined notch', () => {
  const { render } = createPickerRenderer();

  // The collapsed legend keeps a fixed `0.01px` max-width, while the notched legend expands.
  const COLLAPSED_LEGEND_MAX_WIDTH = '0.01px';

  it('should notch the outline when the field is filled and `notched` is not set', () => {
    render(<PickersTextField {...STUB_PROPS} areAllSectionsEmpty={false} label="My label" />);

    const legend = document.querySelector('legend')!;
    expect(window.getComputedStyle(legend).maxWidth).not.to.equal(COLLAPSED_LEGEND_MAX_WIDTH);
  });

  it('should remove the notch when `notched={false}` is passed, even when the field is filled', () => {
    render(
      <PickersTextField
        {...STUB_PROPS}
        areAllSectionsEmpty={false}
        label="My label"
        slotProps={{ input: { notched: false } as any }}
      />,
    );

    const legend = document.querySelector('legend')!;
    expect(window.getComputedStyle(legend).maxWidth).to.equal(COLLAPSED_LEGEND_MAX_WIDTH);
  });
});
