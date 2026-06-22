import * as React from 'react';
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
        InputProps={{ notched: false } as any}
      />,
    );

    const legend = document.querySelector('legend')!;
    expect(window.getComputedStyle(legend).maxWidth).to.equal(COLLAPSED_LEGEND_MAX_WIDTH);
  });
});
