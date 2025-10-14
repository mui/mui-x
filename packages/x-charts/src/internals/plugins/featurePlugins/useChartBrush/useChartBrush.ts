import useEventCallback from '@mui/utils/useEventCallback';
import { ChartPlugin } from '../../models';
import { UseChartBrushSignature, BrushCoordinate } from './useChartBrush.types';

export const useChartBrush: ChartPlugin<UseChartBrushSignature> = ({ store, params }) => {
  const setBrushCoordinates = useEventCallback(function setBrushCoordinates(
    start: BrushCoordinate,
    current: BrushCoordinate,
  ) {
    store.update((prev) => {
      return {
        ...prev,
        brush: {
          start,
          current,
        },
      };
    });

    // Call the callback after updating the state
    params.onBrushChange?.(start, current);
  });

  const clearBrush = useEventCallback(function clearBrush() {
    store.update((prev) => {
      return {
        ...prev,
        brush: {
          start: null,
          current: null,
        },
      };
    });
  });

  return {
    instance: {
      setBrushCoordinates,
      clearBrush,
    },
  };
};

useChartBrush.params = {
  onBrushChange: true,
};

useChartBrush.getInitialState = () => {
  return {
    brush: {
      start: null,
      current: null,
    },
  };
};
