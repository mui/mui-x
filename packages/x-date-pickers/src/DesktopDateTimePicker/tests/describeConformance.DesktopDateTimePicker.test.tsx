import * as React from 'react';
import { expect } from 'chai';
import { screen } from '@mui/internal-test-utils';
import { createPickerRenderer, describePicker } from 'test/utils/pickers';
import { DesktopDateTimePicker } from '@mui/x-date-pickers/DesktopDateTimePicker';
import { describeConformance } from 'test/utils/describeConformance';

describe('<DesktopDateTimePicker /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  it('should respect the `localeText` prop', () => {
    render(
      <DesktopDateTimePicker
        open
        localeText={{ cancelButtonLabel: 'Custom cancel' }}
        slotProps={{ actionBar: { actions: ['cancel'] } }}
      />,
    );

    expect(screen.queryByText('Custom cancel')).not.to.equal(null);
  });

  describePicker(DesktopDateTimePicker, { render, fieldType: 'single-input', variant: 'desktop' });

  describeConformance(<DesktopDateTimePicker />, () => ({
    classes: {} as any,
    render,
    muiName: 'MuiDesktopDateTimePicker',
    refInstanceof: window.HTMLDivElement,
    skip: [
      'componentProp',
      'componentsProp',
      'themeDefaultProps',
      'themeStyleOverrides',
      'themeVariants',
      'mergeClassName',
      'propsSpread',
    ],
  }));
});
