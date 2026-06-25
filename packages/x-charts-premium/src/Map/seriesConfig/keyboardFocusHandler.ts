import type { ChartState, UseChartKeyboardNavigationSignature } from '@mui/x-charts/internals';
import type { FocusedItemIdentifier } from '@mui/x-charts/models';
import type { KeyboardFocusHandler } from '@mui/x-charts/internals';

/**
 * Keyboard navigation for the map series.
 *
 * Because the `mapShape` identifier is keyed by the feature `name` (a string)
 * rather than a numeric `dataIndex`, the generic `createCommonKeyboardFocusHandler`
 * (which steps a numeric index) can't be used
 *
 * `ArrowRight`/`ArrowLeft` move to the next/previous shape of the focused series,
 * `ArrowUp`/`ArrowDown` move between series.
 *
 * Note: hidden shapes/series are not skipped here — the defaultized series read
 * from the state does not carry visibility. Focus may land on a hidden shape.
 */

type MapState = Pick<ChartState<[UseChartKeyboardNavigationSignature], [], 'mapShape'>, 'series'>;

const getMapSeries = (state: MapState) => state.series.defaultizedSeries.mapShape;

const getSeriesData = (state: MapState, seriesId: FocusedItemIdentifier<'mapShape'>['seriesId']) =>
  getMapSeries(state)?.series[seriesId]?.data ?? [];

const toFocusedItem = (
  seriesId: FocusedItemIdentifier<'mapShape'>['seriesId'],
  name: string,
): FocusedItemIdentifier<'mapShape'> => ({ type: 'mapShape', seriesId, name });

/** First focusable shape across all map series. */
function getFirstItem(state: MapState): FocusedItemIdentifier<'mapShape'> | null {
  const mapSeries = getMapSeries(state);
  if (!mapSeries) {
    return null;
  }
  for (const seriesId of mapSeries.seriesOrder) {
    const data = mapSeries.series[seriesId]?.data;
    if (data && data.length > 0) {
      return toFocusedItem(seriesId, data[0].name);
    }
  }
  return null;
}

/** Move within the current series by `direction`. Stays put at the boundary (no cycling). */
function stepWithinSeries(
  currentItem: FocusedItemIdentifier<'mapShape'>,
  state: MapState,
  direction: 1 | -1,
): FocusedItemIdentifier<'mapShape'> | null {
  const data = getSeriesData(state, currentItem.seriesId);
  const current = data.findIndex((d) => d.name === currentItem.name);
  if (current === -1) {
    return getFirstItem(state);
  }
  const next = current + direction;
  if (next < 0 || next >= data.length) {
    return currentItem;
  }
  return toFocusedItem(currentItem.seriesId, data[next].name);
}

/** Move to the first shape of the next/previous series. */
function stepBetweenSeries(
  currentItem: FocusedItemIdentifier<'mapShape'>,
  state: MapState,
  direction: 1 | -1,
): FocusedItemIdentifier<'mapShape'> | null {
  const mapSeries = getMapSeries(state);
  if (!mapSeries) {
    return currentItem;
  }
  const order = mapSeries.seriesOrder;
  const position = order.indexOf(currentItem.seriesId);
  if (position === -1) {
    return getFirstItem(state) ?? currentItem;
  }
  for (let i = position + direction; i >= 0 && i < order.length; i += direction) {
    const data = mapSeries.series[order[i]]?.data;
    if (data && data.length > 0) {
      return toFocusedItem(order[i], data[0].name);
    }
  }
  return currentItem;
}

const keyboardFocusHandler: KeyboardFocusHandler<'mapShape', 'mapShape'> = (event) => {
  switch (event.key) {
    case 'ArrowRight':
      return (currentItem, state) =>
        currentItem ? stepWithinSeries(currentItem, state, 1) : getFirstItem(state);
    case 'ArrowLeft':
      return (currentItem, state) =>
        currentItem ? stepWithinSeries(currentItem, state, -1) : getFirstItem(state);
    case 'ArrowUp':
      return (currentItem, state) =>
        currentItem ? stepBetweenSeries(currentItem, state, 1) : getFirstItem(state);
    case 'ArrowDown':
      return (currentItem, state) =>
        currentItem ? stepBetweenSeries(currentItem, state, -1) : getFirstItem(state);
    default:
      return null;
  }
};

export default keyboardFocusHandler;
