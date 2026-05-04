'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { selectorChartPolarCenter, useChartsContext } from '@mui/x-charts/internals';
import { useUtilityClasses } from './radialBarClasses';
import { useRadialBarPlotData } from './useRadialBarPlotData';
import { RadialBarElement } from './RadialBarElement';

export interface RadialBarPlotProps {
  /**
   * A CSS class name applied to the root element.
   */
  className?: string;
}

const RadialBarPlotRoot = styled('g', {
  name: 'MuiRadialBarPlot',
  slot: 'Root',
})();

/**
 * Demos:
 *
 * - [Radial bar demonstration](https://mui.com/x/react-charts/radial-bar/)
 *
 * API:
 *
 * - [RadialBarPlot API](https://mui.com/x/api/charts/radial-bar-plot/)
 */
function RadialBarPlot(props: RadialBarPlotProps): React.JSX.Element {
  const { className } = props;

  const { completedData } = useRadialBarPlotData();

  const { store } = useChartsContext();
  const { cx, cy } = store.use(selectorChartPolarCenter);

  const classes = useUtilityClasses();

  return (
    <RadialBarPlotRoot
      className={clsx(classes.root, className)}
      transform={`translate(${cx} ${cy})`}
    >
      {completedData.map(({ seriesId, data }) => (
        <g key={seriesId} data-series={seriesId} className={classes.series}>
          {data.map(({ dataIndex, color, startAngle, endAngle, innerRadius, outerRadius }) => (
            <RadialBarElement
              key={dataIndex}
              seriesId={seriesId}
              dataIndex={dataIndex}
              color={color}
              startAngle={startAngle}
              endAngle={endAngle}
              innerRadius={innerRadius}
              outerRadius={outerRadius}
            />
          ))}
        </g>
      ))}
    </RadialBarPlotRoot>
  );
}

RadialBarPlot.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * A CSS class name applied to the root element.
   */
  className: PropTypes.string,
} as any;

export { RadialBarPlot };
