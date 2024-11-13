import { SxProps } from '@mui/material/styles';
import { SlotComponentProps } from '@mui/utils';
import { MakeRequired } from '@mui/x-internals/types';
import { UseFieldInternalProps } from '@mui/x-date-pickers/internals';
import { FieldSection } from '@mui/x-date-pickers/models';
import { PickersTextField } from '@mui/x-date-pickers/PickersTextField';
import type {
  MultiInputFieldRefs,
  MultiInputFieldSlotRootProps,
  RangeFieldSeparatorProps,
  RangePosition,
} from '../../models';

/**
 * Props the multi input field can receive when used inside a picker.
 * Only contains what the MUI components are passing to the field, not what users can pass using the `props.slotProps.field`.
 */
export interface BaseMultiInputFieldProps<
  TValue,
  TSection extends FieldSection,
  TEnableAccessibleFieldDOMStructure extends boolean,
  TError,
> extends MakeRequired<
      Pick<
        UseFieldInternalProps<TValue, TSection, TEnableAccessibleFieldDOMStructure, TError>,
        | 'readOnly'
        | 'disabled'
        | 'format'
        | 'formatDensity'
        | 'enableAccessibleFieldDOMStructure'
        | 'selectedSections'
        | 'onSelectedSectionsChange'
        | 'timezone'
        | 'autoFocus'
        | 'value'
        | 'onChange'
      >,
      'format' | 'value' | 'onChange' | 'timezone'
    >,
    RangeFieldSeparatorProps,
    MultiInputFieldRefs {
  className: string | undefined;
  sx: SxProps<any> | undefined;
  slots?: {
    root?: React.ElementType;
    separator?: React.ElementType;
    textField?: React.ElementType;
  };
  slotProps?: {
    root?: SlotComponentProps<
      React.ElementType<MultiInputFieldSlotRootProps>,
      {},
      Record<string, any>
    >;
    textField?: SlotComponentProps<
      typeof PickersTextField,
      {},
      { position?: RangePosition } & Record<string, any>
    >;
  };
}
