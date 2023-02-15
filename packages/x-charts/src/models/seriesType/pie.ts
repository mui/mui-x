import { CartesianSeriesType, CommonSeriesType } from "./common";

export interface PieSeriesType extends CommonSeriesType , CartesianSeriesType {
  type: 'pie';
}
