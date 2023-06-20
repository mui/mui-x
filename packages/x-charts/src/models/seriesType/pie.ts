import { PieArcDatum as D3PieArcDatum } from 'd3-shape';
import { DefaultizedProps } from '../helpers';
import { CommonDefaultizedProps, CommonSeriesType } from './common';

export type PieValueType = { id: string | number; value: number; label?: string; color?: string };

export interface PieSeriesType extends CommonSeriesType<PieValueType> {
  type: 'pie';
  data: PieValueType[];
}

/**
 * An object that allows to identify a single pie slice.
 * Used for item interaction
 */
export type PieItemIdentifier = {
  type: 'pie';
  seriesId: DefaultizedPieSeriesType['id'];
  dataIndex: number;
};

export interface DefaultizedPieSeriesType
  extends DefaultizedProps<PieSeriesType, CommonDefaultizedProps> {
  data: (PieValueType & D3PieArcDatum<any> & { color: string })[];
}
