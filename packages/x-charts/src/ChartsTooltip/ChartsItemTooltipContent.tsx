'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { SxProps, Theme } from '@mui/material/styles';
import { ChartsTooltipClasses, useUtilityClasses } from './chartsTooltipClasses';
import { useItemTooltip } from './useItemTooltip';
import {
  ChartsItemTooltipContainer,
  ChartsItemTooltipText,
  ChartsTooltipPaper,
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
  const { color, label, formattedValue, markType } = tooltipData;

  return (
    <ChartsTooltipPaper sx={sx} className={classes.paper}>
      <ChartsItemTooltipContainer>
        <ChartsLabelMark type={markType} color={color} className={classes.mark} />
        <ChartsItemTooltipText>
          <span className={classes.labelCell}>{label}</span>
          <span className={classes.valueCell}>{formattedValue}</span>
        </ChartsItemTooltipText>
      </ChartsItemTooltipContainer>
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
