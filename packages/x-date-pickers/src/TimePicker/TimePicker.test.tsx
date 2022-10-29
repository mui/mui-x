import * as React from 'react';
import TextField from '@mui/material/TextField';
import { describeConformance } from '@mui/monorepo/test/utils';
import { fireEvent, screen } from '@mui/monorepo/test/utils/createRenderer';
import { expect } from 'chai';
import {
  createPickerRenderer,
  stubMatchMedia,
  wrapPickerMount,
} from '../../../../test/utils/pickers-utils';
import { TimePicker } from './TimePicker';

describe('<TimePicker />', () => {
  function ControlledTimePicker() {
    const [value, setValue] = React.useState<Date | null>(null);
    return (
      <TimePicker
        renderInput={(params) => <TextField {...params} />}
        value={value}
        onChange={(newValue) => setValue(newValue)}
      />
    );
  }

  describeConformance(
    <TimePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={null}
    />,
    () => ({
      classes: {},
      muiName: 'MuiTimePicker',
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

  const { render } = createPickerRenderer();

  it('should handle controlled `onChange` in desktop mode', () => {
    render(<ControlledTimePicker />);

    fireEvent.change(screen.getByRole('textbox'), { target: { value: '11:30am' } });

    expect(screen.getByDisplayValue('11:30 am')).not.to.equal(null);
  });

  it('should render in mobile mode when `useMediaQuery` returns `false`', () => {
    const originalMatchMedia = window.matchMedia;
    window.matchMedia = stubMatchMedia(false);

    render(
      <TimePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        value={null}
      />,
    );

    expect(screen.getByLabelText(/Choose time/)).to.have.tagName('input');

    window.matchMedia = originalMatchMedia;
  });
});
