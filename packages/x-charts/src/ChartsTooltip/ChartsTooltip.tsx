import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled } from '@mui/material/styles';
import { Popper, PopperProps } from '@mui/base/Popper';
import { NoSsr } from '@mui/base/NoSsr';
import { useSlotProps } from '@mui/base/utils';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import { generateVirtualElement, useMouseTracker, getTootipHasData, TriggerOptions } from './utils';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartsItemContentProps, ChartsItemTooltipContent } from './ChartsItemTooltipContent';
import { ChartsAxisContentProps, ChartsAxisTooltipContent } from './ChartsAxisTooltipContent';
import { ChartsTooltipClasses, getTooltipUtilityClass } from './tooltipClasses';

export interface ChartsTooltipSlots {
  popper?: React.ElementType<PopperProps>;
  axisContent?: React.ElementType<ChartsAxisContentProps>;
  itemContent?: React.ElementType<ChartsItemContentProps>;
}

export interface ChartsTooltipSlotProps {
  popper?: Partial<PopperProps>;
  axisContent?: Partial<ChartsAxisContentProps>;
  itemContent?: Partial<ChartsItemContentProps>;
}

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
   * @deprecated Use slots.itemContent instead
   */
  itemContent?: React.ElementType<ChartsItemContentProps<any>>;
  /**
   * Component to override the tooltip content when triger is set to 'axis'.
   * @deprecated Use slots.axisContent instead
   */
  axisContent?: React.ElementType<ChartsAxisContentProps>;
  /**
   * Override or extend the styles applied to the component.
   */
  classes?: Partial<ChartsTooltipClasses>;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsTooltipSlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsTooltipSlotProps;
};

const useUtilityClasses = (ownerState: { classes: ChartsTooltipProps['classes'] }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    markCell: ['markCell'],
    labelCell: ['labelCell'],
    valueCell: ['valueCell'],
  };

  return composeClasses(slots, getTooltipUtilityClass, classes);
};

const ChartsTooltipRoot = styled(Popper, {
  name: 'MuiChartsTooltip',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
})(({ theme }) => ({
  pointerEvents: 'none',
  zIndex: theme.zIndex.modal,
}));

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
  const { trigger = 'axis', itemContent, axisContent, slots, slotProps } = props;

  const mousePosition = useMouseTracker();

  const { item, axis } = React.useContext(InteractionContext);

  const displayedData = trigger === 'item' ? item : axis;

  const tooltipHasData = getTootipHasData(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;

  const classes = useUtilityClasses({ classes: props.classes });

  const PopperComponent = slots?.popper ?? ChartsTooltipRoot;
  const popperProps = useSlotProps({
    elementType: PopperComponent,
    externalSlotProps: slotProps?.popper,
    additionalProps: {
      open: popperOpen,
      placement: 'right-start' as const,
      anchorEl: generateVirtualElement(mousePosition),
    },
    ownerState: {},
  });

  if (trigger === 'none') {
    return null;
  }

  return (
    <NoSsr>
      {popperOpen && (
        <PopperComponent {...popperProps}>
          {trigger === 'item' ? (
            <ChartsItemTooltipContent
              itemData={displayedData as ItemInteractionData<ChartSeriesType>}
              content={slots?.itemContent ?? itemContent}
              contentProps={slotProps?.itemContent}
              sx={{ mx: 2 }}
              classes={classes}
            />
          ) : (
            <ChartsAxisTooltipContent
              axisData={displayedData as AxisInteractionData}
              content={slots?.axisContent ?? axisContent}
              contentProps={slotProps?.axisContent}
              sx={{ mx: 2 }}
              classes={classes}
            />
          )}
        </PopperComponent>
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
   * @deprecated Use slots.axisContent instead
   */
  axisContent: PropTypes.elementType,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Component to override the tooltip content when triger is set to 'item'.
   * @deprecated Use slots.itemContent instead
   */
  itemContent: PropTypes.elementType,
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
   * @default 'item'
   */
  trigger: PropTypes.oneOf(['axis', 'item', 'none']),
} as any;

export { ChartsTooltip };
