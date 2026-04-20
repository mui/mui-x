import type {
  ChartState,
  UseChartKeyboardNavigationSignature,
  KeyboardFocusHandler,
} from '@mui/x-charts/internals';
import type { FocusedItemIdentifier } from '@mui/x-charts/models';

function getFirstCell(
  state: Pick<ChartState<[UseChartKeyboardNavigationSignature], [], 'heatmap'>, 'series'>,
): FocusedItemIdentifier<'heatmap'> | null {
  const seriesId = state.series.defaultizedSeries.heatmap?.seriesOrder[0];
  const series = state.series.defaultizedSeries.heatmap?.series[seriesId!];
  const data = series?.data;
  if (!seriesId || !series || !data || data.length === 0) {
    return null;
  }

  return { type: 'heatmap', seriesId, xIndex: 0, yIndex: 0 };
}

const updateCoordinates = (
  newXIndex: number,
  newYIndex: number,
  currentItem: FocusedItemIdentifier<'heatmap'>,
) => {
  return {
    ...currentItem,
    xIndex: newXIndex,
    yIndex: newYIndex,
  };
};

const keyboardFocusHandler: KeyboardFocusHandler<'heatmap', 'heatmap'> = (event) => {
  switch (event.key) {
    case 'ArrowRight':
      return (currentItem, state) => {
        if (!currentItem) {
          return getFirstCell(state);
        }
        const maxLength = state.cartesianAxis?.x[0].data?.length;
        if (currentItem.xIndex + 1 === (maxLength ?? 0)) {
          return currentItem;
        }

        return updateCoordinates(currentItem.xIndex + 1, currentItem.yIndex, currentItem);
      };
    case 'ArrowLeft':
      return (currentItem, state) => {
        if (!currentItem) {
          return getFirstCell(state);
        }
        if (currentItem.xIndex - 1 < 0) {
          return currentItem;
        }

        return updateCoordinates(currentItem.xIndex - 1, currentItem.yIndex, currentItem);
      };
    case 'ArrowDown':
      return (currentItem, state) => {
        if (!currentItem) {
          return getFirstCell(state);
        }
        const maxLength = state.cartesianAxis?.y[0].data?.length;
        if (currentItem.yIndex + 1 === (maxLength ?? 0)) {
          return currentItem;
        }
        return updateCoordinates(currentItem.xIndex, currentItem.yIndex + 1, currentItem);
      };
    case 'ArrowUp':
      return (currentItem, state) => {
        if (!currentItem) {
          return getFirstCell(state);
        }

        if (currentItem.yIndex - 1 < 0) {
          return currentItem;
        }
        return updateCoordinates(currentItem.xIndex, currentItem.yIndex - 1, currentItem);
      };
    default:
      return null;
  }
};

export default keyboardFocusHandler;
