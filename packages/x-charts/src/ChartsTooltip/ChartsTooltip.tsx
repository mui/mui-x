'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { ChartsItemTooltipContent } from './ChartsItemTooltipContent';
import { ChartsAxisTooltipContent } from './ChartsAxisTooltipContent';
import { getChartsTooltipUtilityClass } from './chartsTooltipClasses';
import {
  ChartsTooltipContainer,
  ChartsTooltipContainerProps,
  ChartsTooltipContainerSlotProps,
  ChartsTooltipContainerSlots,
} from './ChartsTooltipContainer';

export interface ChartsTooltipProps extends Omit<ChartsTooltipContainerProps, 'children'> {}
export interface ChartsTooltipSlotProps extends ChartsTooltipContainerSlotProps {}
export interface ChartsTooltipSlots extends ChartsTooltipContainerSlots {}

const useUtilityClasses = (ownerState: { classes: ChartsTooltipProps['classes'] }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    paper: ['paper'],
    table: ['table'],
    row: ['row'],
    cell: ['cell'],
    mark: ['mark'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
  };

  return composeClasses(slots, getChartsTooltipUtilityClass, classes);
};

/**
 * Demos:
 *
 * - [ChartsTooltip](https://mui.com/x/react-charts/tooltip/)
 *
 * API:
 *
 * - [ChartsTooltip API](https://mui.com/x/api/charts/charts-tool-tip/)
 */
function ChartsTooltip(props: ChartsTooltipProps) {
  const { classes: propClasses, trigger = 'axis' } = props;

  const classes = useUtilityClasses({ classes: propClasses });

  return (
    <ChartsTooltipContainer {...props} classes={classes}>
      {trigger === 'axis' ? (
        <ChartsAxisTooltipContent classes={classes} />
      ) : (
        <ChartsItemTooltipContent classes={classes} />
      )}
    </ChartsTooltipContainer>
  );
}

ChartsTooltip.propTypes = {
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
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'axis'
   */
  trigger: PropTypes.oneOf(['axis', 'item', 'none']),
} as any;

export { ChartsTooltip };
