'use client';
import * as React from 'react';
import useEventCallback from '@mui/utils/useEventCallback';
import { useChartsContext } from '../context/ChartsProvider';
import type {
  ItemActivationHandler,
  UseChartKeyboardNavigationSignature,
} from './plugins/featurePlugins/useChartKeyboardNavigation';
import type { ChartSeriesType } from '../models/seriesType/config';
import type { SeriesId } from '../models/seriesType/common';
import type { FocusedItemIdentifier } from '../models/seriesType';

/**
 * Registers a handler fired when the keyboard-focused item is activated with <kbd>Enter</kbd> or
 * <kbd>Space</kbd>. It is a no-op when the `keyboardActivation` experimental feature is off.
 *
 * Scope the registration as tightly as the caller knows: when several plots handle the same item,
 * the most specific scope wins, `priority` breaks ties, and the handler runs once.
 *
 * The handler receives the `KeyboardEvent`, typed as `any` because the click callbacks it forwards
 * to only describe the pointer event unless the user augments `keyboardActivationOverride`.
 *
 * @param scope The items covered by the handler. Omit `seriesId` to cover a whole series type.
 * @param handler The handler to call on activation, or `undefined` to register nothing.
 */
export function useRegisterItemActivation<SeriesType extends ChartSeriesType = ChartSeriesType>(
  scope: { type?: SeriesType; seriesId?: SeriesId; priority?: number },
  handler: ((event: any, item: FocusedItemIdentifier<SeriesType>) => void) | undefined,
) {
  const { instance } = useChartsContext<[], [UseChartKeyboardNavigationSignature]>();
  const { type, seriesId, priority } = scope;

  const hasHandler = handler !== undefined;
  const stableHandler = useEventCallback<Parameters<ItemActivationHandler>, void>((event, item) =>
    handler?.(event, item as FocusedItemIdentifier<SeriesType>),
  );

  const registerItemActivationHandler = instance.registerItemActivationHandler;

  React.useEffect(() => {
    if (!hasHandler || !registerItemActivationHandler) {
      return undefined;
    }

    return registerItemActivationHandler({ type, seriesId, priority }, stableHandler);
  }, [registerItemActivationHandler, hasHandler, type, seriesId, priority, stableHandler]);
}
