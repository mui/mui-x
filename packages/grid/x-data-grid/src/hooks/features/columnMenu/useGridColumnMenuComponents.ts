import * as React from 'react';
import { GridColumnMenuRootProps } from './columnMenuInterfaces';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { GridPrivateApiCommunity } from '../../../models/api/gridApiCommunity';

interface GridColumnMenuComponentsProps extends GridColumnMenuRootProps {
  currentColumn: GridColDef;
}

const useGridColumnMenuComponents = (
  apiRef: React.MutableRefObject<GridPrivateApiCommunity>,
  props: GridColumnMenuComponentsProps,
) => {
  const {
    defaultComponents,
    defaultComponentsProps,
    components = {},
    componentsProps = {},
  } = props;

  const processedComponents = React.useMemo(
    () => ({ ...defaultComponents, ...components }),
    [defaultComponents, components],
  );

  const processedComponentsProps = React.useMemo(() => {
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
      (a, b) => processedComponentsProps[a].displayOrder - processedComponentsProps[b].displayOrder,
    );
    // Future Enhancement, pass other `componentsProps` to respective components if needed
    return sorted.reduce<React.JSXElementConstructor<any>[]>((acc, key) => {
      if (!processedComponents[key]) {
        return acc;
      }
      return [...acc, processedComponents[key]!];
    }, []);
  }, [preProcessedItems, processedComponents, processedComponentsProps]);
};

export { useGridColumnMenuComponents };
