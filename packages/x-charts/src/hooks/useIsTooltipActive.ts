import type { TriggerOptions } from '../ChartsTooltip/utils';
import {
  selectorBrushShouldPreventTooltip,
  type UseChartBrushSignature,
} from '../internals/plugins/featurePlugins/useChartBrush';
import { selectorChartsInteractionAxisTooltip } from '../internals/plugins/featurePlugins/useChartCartesianAxis';
import { selectorChartsTooltipItemIsDefined } from '../internals/plugins/featurePlugins/useChartInteraction';
import { selectorChartsInteractionPolarAxisTooltip } from '../internals/plugins/featurePlugins/useChartPolarAxis/useChartPolarInteraction.selectors';
import { useSelector } from '../internals/store/useSelector';
import { useStore } from '../internals/store/useStore';
import { useAxisSystem } from './useAxisSystem';

const selectorReturnFalse = () => false;

function getIsOpenSelector(
  trigger: TriggerOptions,
  axisSystem: 'none' | 'polar' | 'cartesian',
  shouldPreventBecauseOfBrush?: boolean,
) {
  if (shouldPreventBecauseOfBrush) {
    return selectorReturnFalse;
  }
  if (trigger === 'item') {
    return selectorChartsTooltipItemIsDefined;
  }
  if (axisSystem === 'polar') {
    return selectorChartsInteractionPolarAxisTooltip;
  }
  if (axisSystem === 'cartesian') {
    return selectorChartsInteractionAxisTooltip;
  }
  return selectorReturnFalse;
}

/**
 * Returns whether the tooltip is currently active.
 *
 * @param {TriggerOptions} trigger The tooltip type to check.
 *   - 'item': The tooltip is active when hovering over a data item.
 *   - 'axis': The tooltip is active when hovering over an axis.
 * @returns `true` if the tooltip is active, `false` otherwise.
 */
export function useIsTooltipActive(trigger: TriggerOptions): boolean {
  const store = useStore<[UseChartBrushSignature]>();
  const shouldPreventBecauseOfBrush = useSelector(store, selectorBrushShouldPreventTooltip);
  const axisSystem = useAxisSystem();

  const isOpen = useSelector(
    store,
    getIsOpenSelector(trigger, axisSystem, shouldPreventBecauseOfBrush),
  );

  return isOpen;
}

/**
 * Returns whether any type of tooltip (item or axis) is currently active.
 *
 * It is preferred to use the specific `useIsTooltipActive` hook when possible for better performance.
 *
 * @returns `true` if any tooltip is active, `false` otherwise.
 */
export function useIsAnyTooltipActive(): boolean {
  const store = useStore<[UseChartBrushSignature]>();
  const shouldPreventBecauseOfBrush = useSelector(store, selectorBrushShouldPreventTooltip);
  const axisSystem = useAxisSystem();

  const isItemTooltipOpen = useSelector(
    store,
    getIsOpenSelector('item', axisSystem, shouldPreventBecauseOfBrush),
  );

  const isAxisTooltipOpen = useSelector(
    store,
    getIsOpenSelector('axis', axisSystem, shouldPreventBecauseOfBrush),
  );

  return isItemTooltipOpen || isAxisTooltipOpen;
}
