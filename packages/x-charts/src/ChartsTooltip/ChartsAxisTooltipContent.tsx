'use client';
import PropTypes from 'prop-types';
import { type SxProps, type Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { type ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';
import { useAxesTooltip } from './useAxesTooltip';

import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';

export interface ChartsAxisTooltipContentClasses extends ChartsTooltipClasses {}

export interface ChartsAxisTooltipContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
  /**
   * The sort in which series items are displayed in the tooltip.
   * When set to `none`, series are sorted as they are provided in the series property. Otherwise they are sorted by their value.
   * @default 'none'
   */
  sort?: 'none' | 'asc' | 'desc';
}

function ChartsAxisTooltipContent(props: ChartsAxisTooltipContentProps) {
  const { sort } = props;
  const classes = useUtilityClasses(props.classes);

  const tooltipData = useAxesTooltip();

  if (tooltipData === null) {
    return null;
  }

  return (
    <ChartsTooltipPaper sx={props.sx} className={classes.paper}>
      {tooltipData.map(({ axisId, mainAxis, axisValue, axisFormattedValue, seriesItems }) => {
        const sortedItems =
          sort && sort !== 'none'
            ? [...seriesItems].sort((a, b) => {
                const aValue = a.value?.valueOf();
                const bValue = b.value?.valueOf();
                if (typeof aValue !== 'number') {
                  return 1;
                }
                if (typeof bValue !== 'number') {
                  return -1;
                }

                return sort === 'asc' ? aValue - bValue : bValue - aValue;
              })
            : seriesItems;

        return (
          <ChartsTooltipTable className={classes.table} key={axisId}>
            {axisValue != null && !mainAxis.hideTooltip && (
              <Typography component="caption">{axisFormattedValue}</Typography>
            )}

            <tbody>
              {sortedItems.map(({ seriesId, color, formattedValue, formattedLabel, markType }) => {
                if (formattedValue == null) {
                  return null;
                }
                return (
                  <ChartsTooltipRow key={seriesId} className={classes.row}>
                    <ChartsTooltipCell
                      className={clsx(classes.labelCell, classes.cell)}
                      component="th"
                    >
                      <div className={classes.markContainer}>
                        <ChartsLabelMark type={markType} color={color} className={classes.mark} />
                      </div>
                      {formattedLabel || null}
                    </ChartsTooltipCell>
                    <ChartsTooltipCell
                      className={clsx(classes.valueCell, classes.cell)}
                      component="td"
                    >
                      {formattedValue}
                    </ChartsTooltipCell>
                  </ChartsTooltipRow>
                );
              })}
            </tbody>
          </ChartsTooltipTable>
        );
      })}
    </ChartsTooltipPaper>
  );
}

ChartsAxisTooltipContent.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * The sort in which series items are displayed in the tooltip.
   * When set to `none`, series are sorted as they are provided in the series property. Otherwise they are sorted by their value.
   * @default 'none'
   */
  sort: PropTypes.oneOf(['none', 'asc', 'desc']),
} as any;

export { ChartsAxisTooltipContent };
