'use client';
import * as React from 'react';
import { useChartsLocalization } from '../../../hooks';
import { useStore } from '../../store/useStore';
import { selectorChartsZoomAnnouncement } from '../../plugins/featurePlugins/useChartKeyboardNavigation';
import {
  selectorChartZoomMap,
  selectorChartZoomOptionsLookup,
} from '../../plugins/featurePlugins/useChartCartesianAxis';

/**
 * Get the message announcing the visible range of the zoomable axes.
 *
 * The message is taken when the keyboard zoom and pan asks for it, not derived from the zoom
 * itself: the zoom also moves on wheel, drag, and from the application, and the live region must
 * stay silent then.
 * @returns {string | null} the message to announce, or `null` when there is nothing to announce
 */
export function useZoomAnnouncement(): string | null {
  const store = useStore();
  const announcement = store.use(selectorChartsZoomAnnouncement);
  const zoomMap = store.use(selectorChartZoomMap);
  const optionsLookup = store.use(selectorChartZoomOptionsLookup);
  const { localeText } = useChartsLocalization();

  const [message, setMessage] = React.useState<string | null>(null);

  // The announcement is written from the values of the render the request lands on, so a later
  // zoom coming from elsewhere does not rewrite the live region.
  const currentValuesRef = React.useRef({ zoomMap, optionsLookup, localeText });
  currentValuesRef.current = { zoomMap, optionsLookup, localeText };

  React.useEffect(() => {
    if (announcement === 0) {
      setMessage(null);
      return;
    }

    const current = currentValuesRef.current;

    if (!current.zoomMap) {
      return;
    }

    const descriptions = Object.values(current.optionsLookup)
      .map((options) => {
        const zoomData = current.zoomMap!.get(options.axisId);

        if (!zoomData) {
          return null;
        }

        return current.localeText.zoomRangeDescription({
          axisDirection: options.axisDirection,
          start: zoomData.start,
          end: zoomData.end,
        });
      })
      .filter(Boolean);

    setMessage(
      descriptions.length === 0 ? null : descriptions.join(current.localeText.a11yConnector),
    );
  }, [announcement]);

  return message;
}
