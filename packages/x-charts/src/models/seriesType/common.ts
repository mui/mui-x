export type CommonSeriesType = {
  id: string;
};

export type DefaultizedCommonSeriesType = {
  color: string;
};

export type CartesianSeriesType = {
  xAxisKey?: string;
  yAxisKey?: string;
};

export type DefaultizedCartesianSeriesType = Required<CartesianSeriesType>;
