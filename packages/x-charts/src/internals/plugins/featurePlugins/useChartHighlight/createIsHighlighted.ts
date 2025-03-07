import { AxisInteractionData } from '../useChartInteraction/useChartInteraction.types';
import { HighlightScope } from './highlightConfig.types';
import { HighlightItemData } from './useChartHighlight.types';

export const createIsHighlighted =
  (
    highlightScope: HighlightScope | null | undefined,
    highlightedItem: HighlightItemData | null,
    axisInteractionData: AxisInteractionData,
  ) =>
  (item: HighlightItemData | null): boolean => {
    console.log({ highlightScope, item });
    if (!highlightScope || !item) {
      return false;
    }

    if (highlightScope.highlight === 'group') {
      console.log(axisInteractionData, item);
      return axisInteractionData.x?.index === item.dataIndex;
    }

    if (!highlightedItem) {
      return false;
    }

    if (highlightScope.highlight === 'series') {
      return item.seriesId === highlightedItem.seriesId;
    }

    if (highlightScope.highlight === 'item') {
      return (
        item.dataIndex === highlightedItem.dataIndex && item.seriesId === highlightedItem.seriesId
      );
    }

    return false;
  };
