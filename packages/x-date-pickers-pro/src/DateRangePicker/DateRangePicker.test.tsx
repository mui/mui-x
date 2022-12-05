import * as React from 'react';
import TextField from '@mui/material/TextField';
import { describeConformance } from '@mui/monorepo/test/utils';
import { DateRangePicker } from '@mui/x-date-pickers-pro/DateRangePicker';
import { describeRangeValidation } from '@mui/x-date-pickers-pro/tests/describeRangeValidation';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import { createPickerRenderer, stubMatchMedia, wrapPickerMount } from 'test/utils/pickers-utils';

describe('<DateRangePicker />', () => {
  const { render, clock } = createPickerRenderer({ clock: 'fake' });

  describeConformance(
    <DateRangePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={[null, null]}
    />,
    () => ({
      classes: {},
      muiName: 'MuiDateRangePicker',
      wrapMount: wrapPickerMount,
      refInstanceof: window.HTMLDivElement,
      skip: [
        'componentProp',
        'componentsProp',
        'themeDefaultProps',
        'themeStyleOverrides',
        'themeVariants',
        'mergeClassName',
        'propsSpread',
        'rootClass',
        'reactTestRenderer',
      ],
    }),
  );

  describeRangeValidation(DateRangePicker, () => ({
    render,
    clock,
    componentFamily: 'legacy-picker',
    views: ['day'],
  }));

  it('should not open mobile picker dialog when clicked on input', () => {
    render(
      <DateRangePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        value={[null, null]}
      />,
    );
    fireEvent.click(screen.getByRole('textbox'));
    clock.runToLast();

    expect(screen.queryByRole('tooltip')).not.to.equal(null);
    expect(screen.queryByRole('dialog')).to.equal(null);
  });

  it('should open mobile picker dialog when clicked on input when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(
      <DateRangePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        value={[null, null]}
      />,
    );
    fireEvent.click(screen.getByRole('textbox'));
    clock.runToLast();

    expect(screen.getByRole('dialog')).not.to.equal(null);
    expect(screen.queryByRole('tooltip')).to.equal(null);

    window.matchMedia = originalMatchMedia;
  });
});
