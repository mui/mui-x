import * as React from 'react';
import PropTypes from 'prop-types';
import composeClasses from '@mui/utils/composeClasses';
import { styled, useThemeProps, SxProps, Theme } from '@mui/material/styles';
import { PopperProps as BasePopperProps } from '@mui/base/Popper';
import { NoSsr } from '@mui/base/NoSsr';
import { Portal } from '@mui/base';
import { useSlotProps } from '@mui/base/utils';
import {
  AxisInteractionData,
  InteractionContext,
  ItemInteractionData,
} from '../context/InteractionProvider';
import {
  generateVirtualElement,
  useMouseTracker,
  getTooltipHasData,
  TriggerOptions,
  useMouseTrackerRef,
} from './utils';
import { ChartSeriesType } from '../models/seriesType/config';
import { ChartsItemContentProps, ChartsItemTooltipContent } from './ChartsItemTooltipContent';
import { ChartsAxisContentProps, ChartsAxisTooltipContent } from './ChartsAxisTooltipContent';
import { ChartsTooltipClasses, getChartsTooltipUtilityClass } from './chartsTooltipClasses';
import { useSvgRef } from '../hooks';

export type PopperProps = BasePopperProps & {
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx?: SxProps<Theme>;
};

export interface ChartsTooltipSlots {
  /**
   * Custom component for the tooltip popper.
   * @default ChartsTooltipRoot
   */
  popper?: React.ElementType<PopperProps>;
  /**
   * Custom component for displaying tooltip content when triggered by axis event.
   * @default DefaultChartsAxisTooltipContent
   */
  axisContent?: React.ElementType<ChartsAxisContentProps>;
  /**
   * Custom component for displaying tooltip content when triggered by item event.
   * @default DefaultChartsItemTooltipContent
   */
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
   * Component to override the tooltip content when trigger is set to 'item'.
   * @deprecated Use slots.itemContent instead
   */
  itemContent?: React.ElementType<ChartsItemContentProps<any>>;
  /**
   * Component to override the tooltip content when trigger is set to 'axis'.
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

const ChartsTooltipRoot = styled('div', {
  name: 'MuiChartsTooltip',
  slot: 'Root',
  overridesResolver: (_, styles) => styles.root,
  shouldForwardProp(propName) {
    return propName !== 'anchorEl' && propName !== 'ownerState';
  },
})(({ theme, anchorEl }) => {
  const p = anchorEl.getBoundingClientRect();
  return {
    pointerEvents: 'none',
    zIndex: theme.zIndex.modal,
    position: 'fixed',
    top: p.y,
    left: p.x,
  };
});

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
  const themeProps = useThemeProps({
    props,
    name: 'MuiChartsTooltip',
  });
  const { trigger = 'axis', itemContent, axisContent, slots, slotProps } = themeProps;
  const svgRef = useSvgRef();
  const mousePosition = useMouseTrackerRef();

  const { item, axis } = React.useContext(InteractionContext);

  const displayedData = trigger === 'item' ? item : axis;

  const tooltipHasData = getTooltipHasData(trigger, displayedData);
  const popperOpen = mousePosition !== null && tooltipHasData;

  const classes = useUtilityClasses({ classes: themeProps.classes });

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
        <Portal container={svgRef.current?.parentElement}>
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
        </Portal>
      )}
    </NoSsr>
  );
}

ChartsTooltip.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Component to override the tooltip content when trigger is set to 'axis'.
   * @deprecated Use slots.axisContent instead
   */
  axisContent: PropTypes.elementType,
  /**
   * Override or extend the styles applied to the component.
   */
  classes: PropTypes.object,
  /**
   * Component to override the tooltip content when trigger is set to 'item'.
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
