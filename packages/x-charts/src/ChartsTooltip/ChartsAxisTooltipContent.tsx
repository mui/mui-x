'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import { ChartsLabelMarkSlotExtension } from '../ChartsLabel/chartsLabelMark.types';
import { ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';
import { useAxisTooltip } from './useAxisTooltip';
import { useXAxis, useYAxis } from '../hooks';
import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';

export interface ChartsAxisTooltipContentProps extends ChartsLabelMarkSlotExtension {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
}

function ChartsAxisTooltipContent(props: ChartsAxisTooltipContentProps) {
  const { classes: propClasses, sx, slots, slotProps } = props;
  const tooltipData = useAxisTooltip();
  const xAxis = useXAxis();
  const yAxis = useYAxis();

  const classes = useUtilityClasses(propClasses);

  if (tooltipData === null) {
    return null;
  }

  const { axisDirection, axisValue, axisFormattedValue, seriesItems } = tooltipData;

  const axis = axisDirection === 'x' ? xAxis : yAxis;

  return (
    <ChartsTooltipPaper sx={sx} className={classes.paper}>
      <ChartsTooltipTable className={classes.table}>
        {axisValue != null && !axis.hideTooltip && (
          <thead>
            <ChartsTooltipRow className={classes.row}>
              <ChartsTooltipCell colSpan={3} className={clsx(classes.cell, classes.axisValueCell)}>
                <Typography>{axisFormattedValue}</Typography>
              </ChartsTooltipCell>
            </ChartsTooltipRow>
          </thead>
        )}

        <tbody>
          {seriesItems.map(({ seriesId, color, formattedValue, formattedLabel, markType }) => {
            if (formattedValue == null) {
              return null;
            }
            return (
              <ChartsTooltipRow key={seriesId} className={classes.row}>
                <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
                  {color && (
                    <ChartsLabelMark
                      type={markType}
                      color={color}
                      className={classes.mark}
                      seriesId={seriesId}
                      slots={slots}
                      slotProps={slotProps}
                    />
                  )}
                </ChartsTooltipCell>
                <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
                  {formattedLabel ? <Typography>{formattedLabel}</Typography> : null}
                </ChartsTooltipCell>
                <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
                  <Typography>{formattedValue}</Typography>
                </ChartsTooltipCell>
              </ChartsTooltipRow>
            );
          })}
        </tbody>
      </ChartsTooltipTable>
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
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps: PropTypes.object,
  /**
   * Overridable component slots.
   * @default {}
   */
  slots: PropTypes.object,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { ChartsAxisTooltipContent };
