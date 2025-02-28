import type { FieldSection } from '../../models';
import { RangePosition } from './pickers';

export interface FieldRangeSection extends FieldSection {
  dateName: RangePosition;
}

/**
 * Props the single input field can receive when used inside a picker.
 * Only contains what the MUI components are passing to the field, not what users can pass using the `props.slotProps.field`.
 */
export interface BaseSingleInputFieldProps {
  id?: string;
}
