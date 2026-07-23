import * as React from 'react';
import { screen } from '@mui/internal-test-utils';
import { PickersTextField, pickersInputBaseClasses } from '@mui/x-date-pickers/PickersTextField';
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
        <PickersTextField {...STUB_PROPS} />
        <PickersTextField
          {...STUB_PROPS}
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
        <PickersTextField {...STUB_PROPS} />
        <PickersTextField
          {...STUB_PROPS}
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
    const { container } = render(<PickersTextField {...STUB_PROPS} label="My label" />);

    const [opacity] = getSectionsOpacity(container);
    expect(opacity).to.equal('0');
  });
});
