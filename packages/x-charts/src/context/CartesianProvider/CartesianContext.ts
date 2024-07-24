import * as React from 'react';

import { Initializable } from '../context.types';
import {
  AxisDefaultized,
  ScaleName,
  ChartsXAxisProps,
  ChartsYAxisProps,
  AxisId,
} from '../../models/axis';

export type DefaultizedAxisConfig<AxisProps> = {
  [axisId: AxisId]: AxisDefaultized<ScaleName, any, AxisProps>;
};

export type CartesianContextState = {
  /**
   * Mapping from x-axis key to scaling configuration.
   */
  xAxis: DefaultizedAxisConfig<ChartsXAxisProps>;
  /**
   * Mapping from y-axis key to scaling configuration.
   */
  yAxis: DefaultizedAxisConfig<ChartsYAxisProps>;
  /**
   * The x-axes IDs sorted by order they got provided.
   */
  xAxisIds: AxisId[];
  /**
   * The y-axes IDs sorted by order they got provided.
   */
  yAxisIds: AxisId[];
};

export const CartesianContext = React.createContext<Initializable<CartesianContextState>>({
  isInitialized: false,
  data: {
    xAxis: {},
    yAxis: {},
    xAxisIds: [],
    yAxisIds: [],
  },
});

if (process.env.NODE_ENV !== 'production') {
  CartesianContext.displayName = 'CartesianContext';
}
