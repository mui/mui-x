'use client';
import PropTypes from 'prop-types';
import { ChartsTooltipContainer } from '@mui/x-charts/ChartsTooltip';
import { TreemapTooltipContent } from './TreemapTooltipContent';
import type { TreemapTooltipProps } from './TreemapTooltip.types';
import { useUtilityClasses } from './TreemapTooltip.classes';

function TreemapTooltip(props: TreemapTooltipProps) {
  const classes = useUtilityClasses(props);

  return (
    <ChartsTooltipContainer trigger="item" {...props} classes={classes}>
      <TreemapTooltipContent classes={classes} />
    </ChartsTooltipContainer>
  );
}

TreemapTooltip.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Determine if the tooltip should be placed on the pointer location or on the node.
   * @default 'pointer'
   */
  anchor: PropTypes.oneOf(['chart', 'node', 'pointer']),
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
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger: PropTypes.oneOf(['item', 'none']),
} as any;

export { TreemapTooltip };
