import * as React from 'react';
import PropTypes from 'prop-types';
import Popper from '@mui/material/Popper';
import NoSsr from '@mui/material/NoSsr';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { generateVirtualElement, useMouseTracker, getTootipHasData, TriggerOptions } from './utils';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartsItemContentProps, ChartsItemTooltipContent } from './ChartsItemTooltipContent';
import { ChartsAxisContentProps, ChartsAxisTooltipContent } from './ChartsAxisTooltipContent';

export type ChartsTooltipProps = {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger?: TriggerOptions;
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   */
  itemContent?: React.ElementType<ChartsItemContentProps<any>>;
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   */
  axisContent?: React.ElementType<ChartsAxisContentProps>;
};

function ChartsTooltip(props: ChartsTooltipProps) {
  const { trigger = 'axis', itemContent, axisContent } = props;

  const mousePosition = useMouseTracker();

  const { item, axis } = React.useContext(InteractionContext);

  const displayedData = trigger === 'item' ? item : axis;

  const tooltipHasData = getTootipHasData(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;

  if (trigger === 'none') {
    return null;
  }
  return (
    <NoSsr>
      {popperOpen && (
        <Popper
          open={popperOpen}
          placement="right-start"
          anchorEl={generateVirtualElement(mousePosition)}
          style={{ pointerEvents: 'none' }}
        >
          {trigger === 'item' ? (
            <ChartsItemTooltipContent
              itemData={displayedData as ItemInteractionData<ChartSeriesType>}
              content={itemContent}
            />
          ) : (
            <ChartsAxisTooltipContent
              axisData={displayedData as AxisInteractionData}
              content={axisContent}
            />
          )}
        </Popper>
      )}
    </NoSsr>
  );
}

ChartsTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   */
  axisContent: PropTypes.elementType,
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   */
  itemContent: PropTypes.elementType,
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger: PropTypes.oneOf(['axis', 'item', 'none']),
} as any;

export { ChartsTooltip };
