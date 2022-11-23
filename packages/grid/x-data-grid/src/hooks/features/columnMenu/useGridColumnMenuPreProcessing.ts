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
  const { defaultSlots, defaultSlotsProps, slots = {}, slotsProps = {} } = props;

  const processedSlots = React.useMemo(
    () => ({ ...defaultSlots, ...slots }),
    [defaultSlots, slots],
  );

  const processedSlotsProps = React.useMemo(() => {
    if (!slotsProps || Object.keys(slotsProps).length === 0) {
      return defaultSlotsProps;
    }
    const mergedProps = {} as typeof defaultSlotsProps;
    Object.entries(defaultSlotsProps).forEach(([key, currentSlotProps]) => {
      mergedProps[key] = { ...currentSlotProps, ...(slotsProps[key] || {}) };
    });
    return mergedProps;
  }, [defaultSlotsProps, slotsProps]);

  const preProcessedItems = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    [],
    props.currentColumn,
  );

  const components = React.useMemo(() => {
    const sorted = preProcessedItems.sort(
      (a, b) => processedSlotsProps[a].displayOrder - processedSlotsProps[b].displayOrder,
    );
    // Future Enhancement, pass other `slotProps` to respective components if needed
    return sorted.reduce<React.JSXElementConstructor<any>[]>((acc, key) => {
      if (!processedSlots[key]) {
        return acc;
      }
      return [...acc, processedSlots[key]!];
    }, []);
  }, [preProcessedItems, processedSlots, processedSlotsProps]);

  return components;
};

export { useGridColumnMenuPreProcessing };
