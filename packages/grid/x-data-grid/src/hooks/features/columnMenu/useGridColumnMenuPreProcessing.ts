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
  const {
    defaultComponents,
    defaultComponentsProps,
    components = {},
    componentsProps = {},
  } = props;

  const processedSlots = React.useMemo(
    () => ({ ...defaultComponents, ...components }),
    [defaultComponents, components],
  );

  const processedSlotsProps = React.useMemo(() => {
    if (!componentsProps || Object.keys(componentsProps).length === 0) {
      return defaultComponentsProps;
    }
    const mergedProps = {} as typeof defaultComponentsProps;
    Object.entries(defaultComponentsProps).forEach(([key, currentComponentProps]) => {
      mergedProps[key] = { ...currentComponentProps, ...(componentsProps[key] || {}) };
    });
    return mergedProps;
  }, [defaultComponentsProps, componentsProps]);

  const preProcessedItems = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    [],
    props.currentColumn,
  );

  return React.useMemo(() => {
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
};

export { useGridColumnMenuPreProcessing };
