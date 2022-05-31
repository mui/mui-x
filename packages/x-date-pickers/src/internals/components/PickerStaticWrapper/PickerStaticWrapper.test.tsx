import * as React from 'react';
import { describeConformance } from '@mui/monorepo/test/utils';
import { PickerStaticWrapper } from '@mui/x-date-pickers';
import { pickerStaticWrapperClasses as classes } from './pickerStaticWrapperClasses';
import { createPickerRenderer, wrapPickerMount } from '../../../../../../test/utils/pickers-utils';

describe('<PickerStaticWrapper />', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <PickerStaticWrapper
      displayStaticWrapperAs="mobile"
      open
      onDismiss={() => {}}
      onCancel={() => {}}
      onSetToday={() => {}}
      onAccept={() => {}}
      onClear={() => {}}
    />,
    () => ({
      classes,
      refInstanceof: undefined,
      wrapMount: wrapPickerMount,
      render,
      muiName: 'MuiPickerStaticWrapper',
      skip: [
        'componentProp',
        'componentsProp',
        'themeVariants',
        'propsSpread',
        'refForwarding',
        'rootClass',
        'reactTestRenderer',
      ],
    }),
  );
});
