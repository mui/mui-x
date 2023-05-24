import * as React from 'react';
import { unstable_composeClasses as composeClasses } from '@mui/utils';
import { useThemeProps, useTheme, Theme } from '@mui/material/styles';
import { DrawingContext } from '../context/DrawingProvider';
import {
  AnchorPosition,
  SizingParams,
  getLegendSize,
  getSeriesToDisplay,
  getTranslateValues,
} from './utils';
import { SeriesContext } from '../context/SeriesContextProvider';
import { LegendClasses, getLegendUtilityClass } from './legendClasses';
import { DefaultizedProps } from '../models/helpers';

export type LegendProps = {
  position: AnchorPosition;
  offset?: Partial<{ x: number; y: number }>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<LegendClasses>;
} & SizingParams;

type DefaultizedLegendProps = DefaultizedProps<LegendProps, 'direction' | 'position'>;

const useUtilityClasses = (ownerState: DefaultizedLegendProps & { theme: Theme }) => {
  const { classes, direction } = ownerState;
  const slots = {
    root: ['root', direction],
    mark: ['mark'],
    label: ['label'],
    series: ['series'],
  };

  return composeClasses(slots, getLegendUtilityClass, classes);
};

const defaultProps = {
  position: { horizontal: 'middle', vertical: 'top' },
  direction: 'row',
  markSize: 20,
  itemWidth: 100,
  spacing: 2,
} as const;

export function Legend(inProps: LegendProps) {
  const props: DefaultizedLegendProps = useThemeProps({
    props: { ...defaultProps, ...inProps },
    name: 'MuiLegend',
  });

  const { position, direction, markSize, itemWidth, spacing, offset } = props;
  const theme = useTheme();
  const classes = useUtilityClasses({ ...props, theme });

  const { left, top, width, height } = React.useContext(DrawingContext);
  const series = React.useContext(SeriesContext);

  const seriesToDisplay = getSeriesToDisplay(series);

  const legendSize = getLegendSize(seriesToDisplay.length, {
    direction,
    markSize,
    itemWidth,
    spacing,
  });

  const { left: translateLeft, top: translateTop } = getTranslateValues(
    { width, height },
    position,
    legendSize,
  );

  const offsetX = offset?.x ?? 0;
  const offsetY = offset?.y ?? 0;
  return (
    <g
      transform={`translate(${left + translateLeft + offsetX},${top + translateTop + offsetY})`}
      className={classes.root}
    >
      {seriesToDisplay.map(({ id, label, color }, seriesIndex) => (
        <g
          key={id}
          transform={`translate(${direction === 'row' ? seriesIndex * (itemWidth + spacing) : 0}, ${
            direction === 'column' ? seriesIndex * (markSize + spacing) : 0
          })`}
          className={classes.series}
        >
          <rect
            x={0}
            y={0}
            width={markSize}
            height={markSize}
            fill={color}
            className={classes.mark}
          />
          <text
            x={markSize + 5}
            y={markSize / 2}
            alignmentBaseline="central"
            className={classes.label}
          >
            {label}
          </text>
        </g>
      ))}
    </g>
  );
}
