import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { Unstable_DesktopNextTimePicker as DesktopNextTimePicker } from '@mui/x-date-pickers/DesktopNextTimePicker';
import { wrapPickerMount, createPickerRenderer } from 'test/utils/pickers-utils';
import { describeValidation } from '@mui/x-date-pickers/tests/describeValidation';

describe('<DesktopNextTimePicker />', () => {
  const { render, clock } = createPickerRenderer({
    clock: 'fake',
    clockConfig: new Date('2018-01-01T10:05:05.000'),
  });

  describeValidation(DesktopNextTimePicker, () => ({
    render,
    clock,
    views: ['hours', 'minutes'],
    componentFamily: 'new-picker',
  }));

  describeConformance(<DesktopNextTimePicker />, () => ({
    classes: {},
    muiName: 'MuiDesktopTimePicker',
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
  }));
});
