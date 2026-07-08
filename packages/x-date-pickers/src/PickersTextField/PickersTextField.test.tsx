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

describe('<PickersTextField /> - accessibility', () => {
  const { render } = createPickerRenderer();

  // The labeled group must not be a live region, otherwise NVDA re-announces the
  // field label on every section navigation / state change.
  // https://github.com/mui/mui-x/issues/23101
  it('should not set `aria-live` on the labeled group root', () => {
    render(
      <PickersTextField {...STUB_PROPS} variant="standard" label="My label" helperText="Helper" />,
    );

    const group = screen.getByRole('group');
    expect(group).not.to.have.attribute('aria-live');
    // The static relationships stay in place so the label and helper text are still
    // announced once when focus enters the field.
    expect(group).to.have.attribute('aria-labelledby');
    expect(group).to.have.attribute('aria-describedby');
  });

  it('should announce the helper text through a name-less status live region', () => {
    render(
      <PickersTextField {...STUB_PROPS} variant="standard" label="My label" helperText="Helper" />,
    );

    const status = screen.getByRole('status');
    // A live region with its own accessible name would drag that name into every
    // announcement, so the region must stay name-less...
    expect(status).not.to.have.attribute('aria-labelledby');
    expect(status).not.to.have.attribute('aria-label');
    // ...and it must actually carry the helper text, otherwise nothing is announced.
    expect(status).to.have.text('Helper');
  });

  it('should wrap the helper text rather than duplicate it into the DOM', () => {
    render(
      <PickersTextField {...STUB_PROPS} variant="standard" label="My label" helperText="Helper" />,
    );

    // Rendering `helperText` twice would duplicate ids, focusable content and effects
    // (`helperText` is a `ReactNode`). The live region must wrap the single helper text node.
    expect(screen.getAllByText('Helper')).to.have.length(1);
    expect(screen.getByRole('status')).to.contain(screen.getByText('Helper'));
  });

  it('should keep the status live region mounted even without helper text so a later error is announced', () => {
    const { setProps } = render(
      <PickersTextField {...STUB_PROPS} variant="standard" label="My label" />,
    );

    const statusBefore = screen.getByRole('status');
    // The region pre-exists empty so a later content change is announced.
    expect(statusBefore).to.have.text('');

    setProps({ helperText: 'Your date is not valid' });

    // Same stable node across the empty -> error transition, now carrying the error text.
    expect(screen.getByRole('status')).to.equal(statusBefore);
    expect(statusBefore).to.have.text('Your date is not valid');
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
