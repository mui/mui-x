import { useSelector } from '../../../store/useSelector';
import { useStore } from '../../../store/useStore';
import {
  selectorChartsIsFadedCallback,
  selectorChartsIsHighlightedCallback,
} from './useChartHighlight.selectors';

export function useHighlightStateGetter() {
  const store = useStore();

  const isHighlighted = useSelector(store, selectorChartsIsHighlightedCallback);
  const isFaded = useSelector(store, selectorChartsIsFadedCallback);
  return {
    isHighlighted,
    isFaded,
  };
}
