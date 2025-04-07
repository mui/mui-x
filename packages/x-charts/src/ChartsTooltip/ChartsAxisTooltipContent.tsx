'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';
import { useAxesTooltip } from './useAxesTooltip';
import { useXAxis, useYAxis } from '../hooks';
import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';

export interface ChartsAxisTooltipContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
}

function ChartsAxisTooltipContent(props: ChartsAxisTooltipContentProps) {
  const { classes: propClasses, sx } = props;
  const tooltipData = useAxesTooltip();
  const xAxis = useXAxis();
  const yAxis = useYAxis();

  const classes = useUtilityClasses(propClasses);

  if (tooltipData === null) {
    return null;
  }

  return (
    <ChartsTooltipPaper sx={sx} className={classes.paper}>
      {tooltipData.map(({ axisId, axisDirection, axisValue, axisFormattedValue, seriesItems }) => {
        const axis = axisDirection === 'x' ? xAxis : yAxis;
        return (
          <ChartsTooltipTable className={classes.table} key={axisId}>
            {axisValue != null && !axis.hideTooltip && (
              <Typography component="caption">{axisFormattedValue}</Typography>
            )}

            <tbody>
              {seriesItems.map(({ seriesId, color, formattedValue, formattedLabel, markType }) => {
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
} as any;

export { ChartsAxisTooltipContent };
