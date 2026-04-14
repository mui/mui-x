import { PickersTextField, pickersTextFieldClasses } from '@mui/x-date-pickers/PickersTextField';
import { createPickerRenderer } from 'test/utils/pickers';
import { describeConformance } from 'test/utils/describeConformance';

describe('<PickersTextField /> - Describe Conformance', () => {
  const { render } = createPickerRenderer();

  describeConformance(
    <PickersTextField
      {...({
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
      } as any)}
    />,
    () => ({
      classes: pickersTextFieldClasses,
      inheritComponent: 'div',
      render,
      muiName: 'MuiPickersTextField',
      refInstanceof: window.HTMLDivElement,
      skip: ['componentProp', 'themeVariants'],
    }),
  );
});
