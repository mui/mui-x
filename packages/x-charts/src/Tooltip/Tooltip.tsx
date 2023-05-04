import * as React from 'react';
import Popper from '@mui/material/Popper';
import NoSsr from '@mui/material/NoSsr';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { Highlight, HighlightProps } from '../Highlight';
import { generateVirtualElement, useAxisEvents, useMouseTracker, getTootipHasData } from './utils';
import { ChartSeriesType } from '../models/seriesType/config';
import { ItemContentProps, ItemTooltipContent } from './ItemTooltipContent';
import { AxisContentProps, AxisTooltipContent } from './AxisTooltipContent';

export type TooltipProps = {
  /**
   * Select the kind of tooltip to display
   * - 'item': Shows data about the item below the mouse.
   * - 'axis': Shows values associated with the hovered x value
   * - 'none': Does not display tooltip
   * @default 'item'
   */
  trigger?: 'item' | 'axis' | 'none';
  /**
   * Props propagate to the highlight
   */
  highlightProps?: Partial<HighlightProps>;
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   */
  itemContent?: React.ElementType<ItemContentProps<any>>;
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   */
  axisContent?: React.ElementType<AxisContentProps>;
};

export function Tooltip(props: TooltipProps) {
  const { trigger = 'axis', highlightProps, itemContent, axisContent } = props;

  useAxisEvents(trigger);
  const mousePosition = useMouseTracker();

  const { item, axis } = React.useContext(InteractionContext);

  const highlightRef = React.useRef<SVGPathElement>(null);

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
            <ItemTooltipContent
              itemData={displayedData as ItemInteractionData<ChartSeriesType>}
              content={itemContent}
            />
          ) : (
            <AxisTooltipContent
              axisData={displayedData as AxisInteractionData}
              content={axisContent}
            />
          )}
        </Popper>
      )}
      <Highlight ref={highlightRef} highlight={{ x: true, y: false }} {...highlightProps} />
    </NoSsr>
  );
}
