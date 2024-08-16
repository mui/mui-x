import * as React from 'react';
import clsx from 'clsx';
import { useTheme } from '@mui/material/styles';
import { ChartsText, ChartsTextStyle } from '../ChartsText';
import { SeriesId } from '../models/seriesType/common';
import { LegendItemParams } from './chartsLegend.types';
import { ChartsLegendClasses } from './chartsLegendClasses';

export interface ChartsLegendItemProps {
  id: SeriesId;
  index: number;
  positionY: number;
  label: string;
  positionX: number;
  innerHeight: number;
  innerWidth: number;
  color: string;
  gapX: number;
  gapY: number;
  legendWidth: number;
  itemMarkHeight: number;
  itemMarkWidth: number;
  markGap: number;
  labelStyle: ChartsTextStyle;
  classes?: Omit<Partial<ChartsLegendClasses>, 'column' | 'row' | 'label'>;
  onClick?: (legend: LegendItemParams, index: number) => void;
}

/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props: ChartsLegendItemProps) {
  const theme = useTheme();
  const isRTL = theme.direction === 'rtl';
  const {
    id,
    positionY,
    label,
    positionX,
    innerHeight,
    innerWidth,
    legendWidth,
    color,
    gapX,
    gapY,
    itemMarkHeight,
    itemMarkWidth,
    markGap,
    labelStyle,
    classes,
    index,
    onClick,
  } = props;

  return (
    <g
      className={clsx(classes?.series, `${classes?.series}-${id}`)}
      transform={`translate(${gapX + (isRTL ? legendWidth - positionX : positionX)} ${gapY + positionY})`}
    >
      <rect
        x={isRTL ? -(innerWidth + 2) : -2}
        y={-itemMarkHeight / 2 - 2}
        width={innerWidth + 4}
        height={innerHeight + 4}
        fill="transparent"
        className={classes?.itemBackground}
        onClick={onClick ? () => onClick({ id, label, color }, index) : undefined}
        style={{
          pointerEvents: onClick ? 'all' : 'none',
          cursor: onClick ? 'pointer' : 'unset',
        }}
      />
      <rect
        className={classes?.mark}
        x={isRTL ? -itemMarkWidth : 0}
        y={-itemMarkHeight / 2}
        width={itemMarkWidth}
        height={itemMarkHeight}
        fill={color}
        style={{ pointerEvents: 'none' }}
      />
      <ChartsText
        style={{ ...labelStyle, pointerEvents: 'none' }}
        text={label}
        x={(isRTL ? -1 : 1) * (itemMarkWidth + markGap)}
        y={0}
      />
    </g>
  );
}

export { ChartsLegendItem };
