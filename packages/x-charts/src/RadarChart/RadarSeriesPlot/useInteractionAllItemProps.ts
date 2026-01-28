import * as React from 'react';
import { type SeriesItemIdentifierWithData } from '../../models/seriesType';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import { type UseChartHighlightSignature } from '../../internals/plugins/featurePlugins/useChartHighlight';
import { type UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { type UseChartTooltipSignature } from '../../internals/plugins/featurePlugins/useChartTooltip';
import { getInteractionItemProps } from '../../hooks/useInteractionItemProps';

export const useInteractionAllItemProps = (
  data: SeriesItemIdentifierWithData<'radar'>[],
  skip?: boolean,
) => {
  const { instance } =
    useChartContext<
      [UseChartInteractionSignature, UseChartHighlightSignature, UseChartTooltipSignature]
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
