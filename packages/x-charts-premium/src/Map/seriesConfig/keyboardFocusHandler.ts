import type {
  ChartState,
  UseChartKeyboardNavigationSignature,
  KeyboardFocusHandler,
} from '@mui/x-charts/internals';
import { selectorChartSeriesProcessed } from '@mui/x-charts/internals';
import type { FocusedItemIdentifier } from '@mui/x-charts/models';

/**
 * Keyboard navigation for the map series.
 *
 * The `mapShape` identifier is keyed by the feature `name` (a string), so the
 * generic `createCommonKeyboardFocusHandler` (which steps a numeric index) cannot
 * be reused. The focus is stepped by data-array position internally, while the `name`
 * at the landing position is emitted. Hidden shapes and hidden or empty series are skipped.
 *
 * `ArrowRight` and `ArrowLeft` move to the next or previous visible shape of the focused series.
 * `ArrowUp` and `ArrowDown` move between series.
 */

type MapState = Pick<ChartState<[UseChartKeyboardNavigationSignature], [], 'mapShape'>, 'series'>;

// Read the processed series (not `defaultizedSeries`) because that is where the
// per-item/per-series `hidden` flags are populated by the series processor.
const getMapSeries = (state: MapState) =>
  selectorChartSeriesProcessed(state as ChartState<[UseChartKeyboardNavigationSignature], []>)
    .mapShape;

type MapSeries = NonNullable<ReturnType<typeof getMapSeries>>;

const toFocusedItem = (
  seriesId: FocusedItemIdentifier<'mapShape'>['seriesId'],
  name: string,
): FocusedItemIdentifier<'mapShape'> => ({ type: 'mapShape', seriesId, name });

/**
 * Returns the first non-hidden index in `data`, starting at `start` and moving by `step`.
 * Returns `null` if the edge of the array is reached before a visible item is found.
 */
function nextVisibleIndex(
  data: readonly { hidden: boolean }[],
  start: number,
  step: 1 | -1,
): number | null {
  for (let i = start; i >= 0 && i < data.length; i += step) {
    if (!data[i].hidden) {
      return i;
    }
  }
  return null;
}

/**
 * Returns the name of the first visible shape of a series.
 * Returns `null` if the series is hidden, empty, or contains only hidden shapes.
 */
function firstVisibleName(
  mapSeries: MapSeries,
  seriesId: FocusedItemIdentifier<'mapShape'>['seriesId'],
): string | null {
  const series = mapSeries.series[seriesId];
  if (!series || series.hidden) {
    return null;
  }
  const index = nextVisibleIndex(series.data, 0, 1);
  return index === null ? null : series.data[index].name;
}

/**
 * Returns the first focusable shape across all visible map series, or `null` if none is visible.
 */
function getFirstItem(state: MapState): FocusedItemIdentifier<'mapShape'> | null {
  const mapSeries = getMapSeries(state);
  if (!mapSeries) {
    return null;
  }
  for (const seriesId of mapSeries.seriesOrder) {
    const name = firstVisibleName(mapSeries, seriesId);
    if (name !== null) {
      return toFocusedItem(seriesId, name);
    }
  }
  return null;
}

/**
 * Moves the focus within the current series by `direction`, skipping hidden shapes.
 * Returns the current item unchanged when a boundary is reached, since cycling is disabled.
 */
function stepWithinSeries(
  currentItem: FocusedItemIdentifier<'mapShape'>,
  state: MapState,
  direction: 1 | -1,
): FocusedItemIdentifier<'mapShape'> | null {
  const series = getMapSeries(state)?.series[currentItem.seriesId];
  if (!series) {
    return currentItem;
  }
  const current = series.data.findIndex((d) => d.name === currentItem.name);
  if (current === -1) {
    return getFirstItem(state);
  }
  const next = nextVisibleIndex(series.data, current + direction, direction);
  return next === null ? currentItem : toFocusedItem(currentItem.seriesId, series.data[next].name);
}

/**
 * Moves the focus to the first visible shape of the next or previous visible series,
 * depending on `direction`.
 */
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
    const name = firstVisibleName(mapSeries, order[i]);
    if (name !== null) {
      return toFocusedItem(order[i], name);
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
