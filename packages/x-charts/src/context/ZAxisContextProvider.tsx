import * as React from 'react';
import PropTypes from 'prop-types';
import { DatasetType } from '../models/seriesType/config';
import { MakeOptional } from '../models/helpers';
import { getColorScale, getOrdinalColorScale } from '../internals/colorScale';
import { ZAxisConfig, ZAxisDefaultized } from '../models/z-axis';

export type ZAxisContextProviderProps = {
  /**
   * The configuration of the z-axes.
   */
  zAxis?: MakeOptional<ZAxisConfig, 'id'>[];
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset?: DatasetType;
  children: React.ReactNode;
};

type DefaultizedZAxisConfig = {
  [axisId: string]: ZAxisDefaultized;
};

export const ZAxisContext = React.createContext<{
  /**
   * Mapping from z-axis key to scaling configuration.
   */
  zAxis: DefaultizedZAxisConfig;
  /**
   * The z-axes IDs sorted by order they got provided.
   */
  zAxisIds: string[];
}>({ zAxis: {}, zAxisIds: [] });

if (process.env.NODE_ENV !== 'production') {
  ZAxisContext.displayName = 'ZAxisContext';
}

function ZAxisContextProvider(props: ZAxisContextProviderProps) {
  const { zAxis: inZAxis, dataset, children } = props;

  const zAxis = React.useMemo(
    () =>
      inZAxis?.map((axisConfig) => {
        const dataKey = axisConfig.dataKey;
        if (dataKey === undefined || axisConfig.data !== undefined) {
          return axisConfig;
        }
        if (dataset === undefined) {
          throw Error('MUI X: z-axis uses `dataKey` but no `dataset` is provided.');
        }
        return {
          ...axisConfig,
          data: dataset.map((d) => d[dataKey]),
        };
      }),
    [inZAxis, dataset],
  );

  const value = React.useMemo(() => {
    const allZAxis: ZAxisConfig[] =
      zAxis?.map((axis, index) => ({ id: `defaultized-z-axis-${index}`, ...axis })) ?? [];

    const completedZAxis: DefaultizedZAxisConfig = {};
    allZAxis.forEach((axis) => {
      completedZAxis[axis.id] = {
        ...axis,
        colorScale:
          axis.colorMap &&
          (axis.colorMap.type === 'ordinal' && axis.data
            ? getOrdinalColorScale({ values: axis.data, ...axis.colorMap })
            : getColorScale(
                axis.colorMap.type === 'continuous'
                  ? { min: axis.min, max: axis.max, ...axis.colorMap }
                  : axis.colorMap,
              )),
      };
    });

    return {
      zAxis: completedZAxis,
      zAxisIds: allZAxis.map(({ id }) => id),
    };
  }, [zAxis]);

  return <ZAxisContext.Provider value={value}>{children}</ZAxisContext.Provider>;
}

ZAxisContextProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * An array of objects that can be used to populate series and axes data using their `dataKey` property.
   */
  dataset: PropTypes.arrayOf(PropTypes.object),
  /**
   * The configuration of the z-axes.
   */
  zAxis: PropTypes.arrayOf(
    PropTypes.shape({
      colorMap: PropTypes.oneOfType([
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          type: PropTypes.oneOf(['ordinal']).isRequired,
          unknownColor: PropTypes.string,
          values: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number, PropTypes.string])
              .isRequired,
          ),
        }),
        PropTypes.shape({
          color: PropTypes.oneOfType([
            PropTypes.arrayOf(PropTypes.string.isRequired),
            PropTypes.func,
          ]).isRequired,
          max: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          min: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]),
          type: PropTypes.oneOf(['continuous']).isRequired,
        }),
        PropTypes.shape({
          colors: PropTypes.arrayOf(PropTypes.string).isRequired,
          thresholds: PropTypes.arrayOf(
            PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.number]).isRequired,
          ).isRequired,
          type: PropTypes.oneOf(['piecewise']).isRequired,
        }),
      ]),
      data: PropTypes.array,
      dataKey: PropTypes.string,
      id: PropTypes.string,
      max: PropTypes.number,
      min: PropTypes.number,
    }),
  ),
} as any;

export { ZAxisContextProvider };
