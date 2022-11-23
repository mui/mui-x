import * as React from 'react';
import { GridColumnMenuRootProps } from './columnMenuInterfaces';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

interface GridColumnMenuPreProcessingProps extends GridColumnMenuRootProps {
  currentColumn: GridColDef;
}

const useGridColumnMenuPreProcessing = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: GridColumnMenuPreProcessingProps,
) => {
  const preProcessedItems = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    props.initialItems,
    {
      column: props.currentColumn,
      slots: props.slots,
    },
  );

  const components = React.useMemo(() => {
    const sorted = preProcessedItems.sort((a, b) => a.displayOrder - b.displayOrder);
    return sorted.reduce<React.JSXElementConstructor<any>[]>((acc, item) => {
      if (!item || !item.component) {
        return acc;
      }
      return [...acc, item.component];
    }, []);
  }, [preProcessedItems]);

  return components;
};

export { useGridColumnMenuPreProcessing };
