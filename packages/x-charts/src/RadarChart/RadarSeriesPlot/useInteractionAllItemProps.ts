import * as React from 'react';
import type { SeriesItemIdentifierWithData } from '../../models/seriesType';
import { useChartsContext } from '../../context/ChartsProvider/useChartsContext';
import type { UseChartHighlightSignature } from '../../internals/plugins/featurePlugins/useChartHighlight';
import type { UseChartKeyboardNavigationSignature } from '../../internals/plugins/featurePlugins/useChartKeyboardNavigation';
import type { UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import type { UseChartTooltipSignature } from '../../internals/plugins/featurePlugins/useChartTooltip';
import { getInteractionItemProps } from '../../hooks/useInteractionItemProps';

export const useInteractionAllItemProps = (
  data: SeriesItemIdentifierWithData<'radar'>[],
  skip?: boolean,
) => {
  const { instance } =
    useChartsContext<
      [
        UseChartInteractionSignature,
        UseChartHighlightSignature<'radar'>,
        UseChartTooltipSignature,
        UseChartKeyboardNavigationSignature,
      ]
    >();

  const results = React.useMemo(() => {
    return data.map((item) => {
      return skip
        ? {}
        : getInteractionItemProps(instance, {
            type: 'radar',
            seriesId: item.seriesId,
            dataIndex: item.dataIndex,
          });
    });
  }, [data, instance, skip]);

  return results;
};
