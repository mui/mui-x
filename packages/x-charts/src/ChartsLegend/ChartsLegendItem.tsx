import * as React from 'react';
import clsx from 'clsx';
import { useRtl } from '@mui/system/RtlProvider';
import { ChartsText, ChartsTextStyle } from '../ChartsText';
import { LegendItemParams } from './chartsLegend.types';
import { ChartsLegendClasses } from './chartsLegendClasses';

export interface ChartsLegendItemProps extends LegendItemParams {
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
  onClick?: (event: React.MouseEvent<SVGRectElement, MouseEvent>) => void;
}

/**
 * @ignore - internal component.
 */
function ChartsLegendItem(props: ChartsLegendItemProps) {
  const isRTL = useRtl();
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
        onClick={onClick}
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
        style={{ pointerEvents: 'none', ...labelStyle }}
        text={label}
        x={(isRTL ? -1 : 1) * (itemMarkWidth + markGap)}
        y={0}
      />
    </g>
  );
}

export { ChartsLegendItem };
