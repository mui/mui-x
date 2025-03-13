'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { SxProps, Theme } from '@mui/material/styles';
import { ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
import { useItemTooltip } from './useItemTooltip';
import {
  ChartsTooltipCell,
  ChartsTooltipPaper,
  ChartsTooltipRow,
  ChartsTooltipTable,
} from './ChartsTooltipTable';
import { ChartsLabelMark } from '../ChartsLabel/ChartsLabelMark';

export interface ChartsItemTooltipContentProps {
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  sx?: SxProps<Theme>;
}

function ChartsItemTooltipContent(props: ChartsItemTooltipContentProps) {
  const { classes: propClasses, sx } = props;
  const tooltipData = useItemTooltip();

  const classes = useUtilityClasses(propClasses);

  if (!tooltipData) {
    return null;
  }

  if (Array.isArray(tooltipData)) {
    const { markType: seriesMarkType, color: seriesColor, label: seriesLabel } = tooltipData[0];
    return (
      <ChartsTooltipPaper sx={sx} className={classes.paper}>
        <ChartsTooltipTable className={classes.table}>
          <thead>
            <ChartsTooltipRow className={classes.row}>
              <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
                <ChartsLabelMark
                  type={seriesMarkType}
                  color={seriesColor}
                  className={classes.mark}
                />
              </ChartsTooltipCell>
              <ChartsTooltipCell colSpan={2} className={clsx(classes.cell, classes.axisValueCell)}>
                {seriesLabel}
              </ChartsTooltipCell>
            </ChartsTooltipRow>
          </thead>
          <tbody>
            {tooltipData.map(({ color, formattedValue, markType, axisFormattedValue }) => (
              <ChartsTooltipRow className={classes.row}>
                <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
                  <ChartsLabelMark type={markType} color={color} className={classes.mark} />
                </ChartsTooltipCell>
                <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
                  {axisFormattedValue}
                </ChartsTooltipCell>
                <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
                  {formattedValue}
                </ChartsTooltipCell>
              </ChartsTooltipRow>
            ))}
          </tbody>
        </ChartsTooltipTable>
      </ChartsTooltipPaper>
    );
  }

  const { color, label, formattedValue, markType } = tooltipData;

  return (
    <ChartsTooltipPaper sx={sx} className={classes.paper}>
      <ChartsTooltipTable className={classes.table}>
        <tbody>
          <ChartsTooltipRow className={classes.row}>
            <ChartsTooltipCell className={clsx(classes.markCell, classes.cell)}>
              <ChartsLabelMark type={markType} color={color} className={classes.mark} />
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.labelCell, classes.cell)}>
              {label}
            </ChartsTooltipCell>
            <ChartsTooltipCell className={clsx(classes.valueCell, classes.cell)}>
              {formattedValue}
            </ChartsTooltipCell>
          </ChartsTooltipRow>
        </tbody>
      </ChartsTooltipTable>
    </ChartsTooltipPaper>
  );
}

ChartsItemTooltipContent.propTypes = {
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

export { ChartsItemTooltipContent };
