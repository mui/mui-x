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
 * The `mapShape` identifier is keyed by the feature `name` (a string), so the generic
 * `createCommonKeyboardFocusHandler` (which steps a numeric index) cannot be reused.
 *
 * Navigation runs on a flattened list of the currently visible shapes, grouped by series.
 * Hidden shapes and hidden or empty series are excluded up front, so a key press never has
 * to special-case visibility — it is a simple, bounds-checked move on that list:
 *
 * - `ArrowRight` and `ArrowLeft` step within the focused series.
 * - `ArrowUp` and `ArrowDown` move to the first shape of the next or previous series.
 */

type MapState = Pick<ChartState<[UseChartKeyboardNavigationSignature], [], 'mapShape'>, 'series'>;

type SeriesId = FocusedItemIdentifier<'mapShape'>['seriesId'];

/** A series with at least one visible shape, holding its visible shape names in order. */
type VisibleSeries = { seriesId: SeriesId; names: string[] };

/** A location in the visible list: the series index and the shape index within it. */
type Position = { series: number; shape: number };

const toFocusedItem = (seriesId: SeriesId, name: string): FocusedItemIdentifier<'mapShape'> => ({
  type: 'mapShape',
  seriesId,
  name,
});

/**
 * Returns the visible shapes grouped by series, in navigation order.
 *
 * Reads the processed series (not `defaultizedSeries`) because that is where the per-item
 * and per-series `hidden` flags are populated by the series processor.
 */
function getVisibleSeries(state: MapState): VisibleSeries[] {
  const mapSeries = selectorChartSeriesProcessed(
    state as ChartState<[UseChartKeyboardNavigationSignature], []>,
  ).mapShape;
  if (!mapSeries) {
    return [];
  }

  const visible: VisibleSeries[] = [];
  for (const seriesId of mapSeries.seriesOrder) {
    const series = mapSeries.series[seriesId];
    if (!series || series.hidden) {
      continue;
    }
    const names = series.data.filter((shape) => !shape.hidden).map((shape) => shape.name);
    if (names.length > 0) {
      visible.push({ seriesId, names });
    }
  }
  return visible;
}

/** Returns the position of `currentItem` in the visible list, or `null` if it is no longer visible. */
function locate(
  visible: VisibleSeries[],
  currentItem: FocusedItemIdentifier<'mapShape'>,
): Position | null {
  const series = visible.findIndex((entry) => entry.seriesId === currentItem.seriesId);
  if (series === -1) {
    return null;
  }
  const shape = visible[series].names.indexOf(currentItem.name);
  return shape === -1 ? null : { series, shape };
}

/** Maps each handled key to the next position, or `null` to stay put at a boundary. */
const MOVES: Record<string, (position: Position, visible: VisibleSeries[]) => Position | null> = {
  ArrowRight: ({ series, shape }, visible) => ({
    series,
    shape: Math.min(shape + 1, visible[series].names.length - 1),
  }),
  ArrowLeft: ({ series, shape }) => ({ series, shape: Math.max(shape - 1, 0) }),
  ArrowUp: ({ series }, visible) =>
    series + 1 < visible.length ? { series: series + 1, shape: 0 } : null,
  ArrowDown: ({ series }) => (series - 1 >= 0 ? { series: series - 1, shape: 0 } : null),
};

const keyboardFocusHandler: KeyboardFocusHandler<'mapShape', 'mapShape'> = (event) => {
  const move = MOVES[event.key];
  if (!move) {
    return null;
  }

  return (currentItem, state) => {
    const visible = getVisibleSeries(state);
    if (visible.length === 0) {
      return null;
    }

    // No focus yet, or the focused shape is no longer visible: start from the first shape.
    const position = currentItem && locate(visible, currentItem);
    if (!position) {
      return toFocusedItem(visible[0].seriesId, visible[0].names[0]);
    }

    // `null` means a boundary was reached, so the focus stays on the current shape.
    const next = move(position, visible) ?? position;
    return toFocusedItem(visible[next.series].seriesId, visible[next.series].names[next.shape]);
  };
};

export default keyboardFocusHandler;
