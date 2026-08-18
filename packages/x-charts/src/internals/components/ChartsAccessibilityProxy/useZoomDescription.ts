import { useChartsLocalization } from '../../../hooks';
import { useStore } from '../../store/useStore';
import { selectorChartsIsZoomAnnounced } from '../../plugins/featurePlugins/useChartKeyboardNavigation';
import {
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '../../plugins/featurePlugins/useChartCartesianAxis';

/**
 * Get the message describing the visible range of the zoomable axes.
 * It is only returned once the user changed the zoom from the keyboard, so that pointer
 * interactions do not make the live region speak.
 * @returns {string | null} the accessibility description of the visible zoom range
 */
export function useZoomDescription(): string | null {
  const store = useStore();
  const isAnnounced = store.use(selectorChartsIsZoomAnnounced);
  const zoomMap = store.use(selectorChartZoomMap);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);

  const { localeText } = useChartsLocalization();

  if (!isAnnounced || !zoomMap) {
    return null;
  }

  const descriptions = Object.values(optionsLookup)
    .map((options) => {
      const zoomData = zoomMap.get(options.axisId);

      if (!zoomData) {
        return null;
      }

      return localeText.zoomRangeDescription({
        axisDirection: options.axisDirection,
        start: zoomData.start,
        end: zoomData.end,
      });
    })
    .filter(Boolean);

  return descriptions.length === 0 ? null : descriptions.join(localeText.a11yConnector);
}
