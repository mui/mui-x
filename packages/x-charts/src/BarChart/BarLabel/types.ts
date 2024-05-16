import { BarItem, BarLabelContext } from '../../models';
import { SeriesId } from '../../models/seriesType/common';
import type { BarLabelClasses } from './barLabelClasses';

export interface BarLabelOwnerState {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  isFaded: boolean;
  isHighlighted: boolean;
  classes?: Partial<BarLabelClasses>;
}

export type BarLabelComponentProps = Omit<React.ComponentPropsWithoutRef<'text'>, 'id'> & {
  ownerState: BarLabelOwnerState;
};

export type BarLabelFunction = (item: BarItem, context: BarLabelContext) => string | null;
