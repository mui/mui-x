import {
  createCommonKeyboardFocusHandler,
  selectorChartSeriesProcessed,
} from '@mui/x-charts/internals';
import type {
  ChartState,
  UseChartKeyboardNavigationSignature,
  KeyboardFocusHandler,
} from '@mui/x-charts/internals';

/**
 * Keyboard navigation for the map series.
 *
 * The `mapShape` identifier is keyed by the feature `name` (a string), but navigation itself
 * is position-based, so the shared `createCommonKeyboardFocusHandler` does all the work
 * (stepping, hidden-skipping, boundaries, moving between series). This handler only adapts the
 * boundaries: it translates the focused `name` to a `dataIndex` on the way in (through the
 * series `lookupByName` map), and the resulting `dataIndex` back to a `name` on the way out.
 *
 * `ArrowRight`/`ArrowLeft` step within the focused series, `ArrowUp`/`ArrowDown` move between series.
 */

type MapState = Pick<ChartState<[UseChartKeyboardNavigationSignature], [], 'mapShape'>, 'series'>;

const mapShapeSeriesTypes = new Set(['mapShape'] as const);
const allowCycles = false;
const useCurrentSeriesMaxLength = true;

const commonFocusHandler = createCommonKeyboardFocusHandler(
  mapShapeSeriesTypes,
  allowCycles,
  useCurrentSeriesMaxLength,
);

const getMapSeries = (state: MapState) =>
  selectorChartSeriesProcessed(state as ChartState<[UseChartKeyboardNavigationSignature], []>)
    .mapShape;

const keyboardFocusHandler: KeyboardFocusHandler<'mapShape', 'mapShape'> = (event) => {
  const updateFocusedItem = commonFocusHandler(event);
  if (!updateFocusedItem) {
    return null;
  }

  return (currentItem, state) => {
    const mapSeries = getMapSeries(state);

    // name -> dataIndex
    const current = currentItem
      ? {
          type: 'mapShape' as const,
          seriesId: currentItem.seriesId,
          dataIndex: mapSeries?.series[currentItem.seriesId]?.lookupByName.get(currentItem.name) ?? -1,
        }
      : null;

    const next = updateFocusedItem(current, state);
    if (!next) {
      return null;
    }

    // dataIndex -> name
    const name = mapSeries?.series[next.seriesId]?.data[next.dataIndex]?.name;
    return name === undefined ? null : { type: 'mapShape', seriesId: next.seriesId, name };
  };
};

export default keyboardFocusHandler;
