import * as React from 'react';
import { createRenderer, describeConformance } from '@mui/monorepo/test/utils';
import { PickerStaticWrapper } from './PickerStaticWrapper';
import { pickerStaticWrapperClasses as classes } from './pickerStaticWrapperClasses';

describe('<PickerStaticWrapper />', () => {
  const { render } = createRenderer();

  describeConformance(<PickerStaticWrapper displayStaticWrapperAs="mobile" />, () => ({
    classes,
    muiName: 'MuiPickerStaticWrapper',
    refInstanceof: undefined,
    render,
    skip: [
      'componentProp',
      'componentsProp',
      'themeVariants',
      'propsSpread',
      'refForwarding',
      'rootClass',
    ],
  }));
});
