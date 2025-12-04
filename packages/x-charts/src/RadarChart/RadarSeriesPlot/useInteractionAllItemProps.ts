import * as React from 'react';
import { SeriesItemIdentifierWithData } from '../../models/seriesType';
import { useChartContext } from '../../context/ChartProvider/useChartContext';
import { UseChartHighlightSignature } from '../../internals/plugins/featurePlugins/useChartHighlight';
import { UseChartInteractionSignature } from '../../internals/plugins/featurePlugins/useChartInteraction';
import { getInteractionItemProps } from '../../hooks/useInteractionItemProps';

export const useInteractionAllItemProps = (
  data: SeriesItemIdentifierWithData<'radar'>[],
  skip?: boolean,
) => {
  const { instance } =
    useChartContext<[UseChartInteractionSignature, UseChartHighlightSignature]>();

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
