import * as React from 'react';
import TextField from '@mui/material/TextField';
import { MobileDateRangePicker } from '@mui/x-pickers/MobileDateRangePicker';
import { describeConformance } from '@mui/monorepo/test/utils';
import { wrapPickerMount, createPickerRenderer } from '../internal/utils/test-utils';

describe('<MobileDateRangePicker />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <MobileDateRangePicker
      onChange={() => {}}
      renderInput={(props) => <TextField {...props} />}
      value={[null, null]}
    />,
    () => ({
      classes: {},
      muiName: 'MuiMobileDateRangePicker',
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

  // TODO: Write actual test. This test should be removed after adding actual tests.
  it('renders without crashing', () => {
    render(
      <MobileDateRangePicker
        renderInput={(params) => <TextField {...params} />}
        onChange={() => {}}
        value={[null, null]}
      />,
    );
  });
});
