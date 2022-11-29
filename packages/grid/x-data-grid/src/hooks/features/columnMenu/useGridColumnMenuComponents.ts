import * as React from 'react';
import { GridColumnMenuRootProps } from './columnMenuInterfaces';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';

interface UseGridColumnMenuComponentsProps extends GridColumnMenuRootProps {
  currentColumn: GridColDef;
}

type UseGridColumnMenuComponentsResponse = Array<
  [React.JSXElementConstructor<any>, { [key: string]: any }]
>;

const camelize = (pascalCase: string) => {
  const camelCase = pascalCase.split('');
  camelCase[0] = camelCase[0].toLowerCase();
  return camelCase.join('');
};

const useGridColumnMenuComponents = (props: UseGridColumnMenuComponentsProps) => {
  const apiRef = useGridPrivateApiContext();
  const {
    defaultComponents,
    defaultComponentsProps,
    components = {},
    componentsProps = {},
    customItems = [],
  } = props;

  const processedComponents = React.useMemo(
    () => ({ ...defaultComponents, ...components }),
    [defaultComponents, components],
  );

  const processedComponentsProps = React.useMemo(() => {
    if (!componentsProps || Object.keys(componentsProps).length === 0) {
      return defaultComponentsProps;
    }
    const mergedProps = { ...componentsProps } as typeof defaultComponentsProps;
    Object.entries(defaultComponentsProps).forEach(([key, currentComponentProps]) => {
      mergedProps[key] = { ...currentComponentProps, ...(componentsProps[key] || {}) };
    });
    return mergedProps;
  }, [defaultComponentsProps, componentsProps]);

  const preProcessedItems = apiRef.current.unstable_applyPipeProcessors(
    'columnMenu',
    customItems,
    props.currentColumn,
  );

  return React.useMemo(() => {
    const uniqueItems = Array.from(new Set<string>(preProcessedItems));
    const sorted = uniqueItems.sort((a, b) => {
      const leftItemProps = processedComponentsProps[camelize(a)];
      const rightItemProps = processedComponentsProps[camelize(b)];
      const leftDisplayOrder = Number.isFinite(leftItemProps?.displayOrder)
        ? leftItemProps.displayOrder
        : 100;
      const rightDisplayOrder = Number.isFinite(rightItemProps?.displayOrder)
        ? rightItemProps.displayOrder
        : 100;
      return leftDisplayOrder! - rightDisplayOrder!;
    });
    return sorted.reduce<UseGridColumnMenuComponentsResponse>((acc, key) => {
      if (processedComponents[key] == null) {
        return acc;
      }
      const processedComponentProps = processedComponentsProps[camelize(key)] || {};
      if (processedComponentProps) {
        const { displayOrder, ...customProps } = processedComponentProps;
        return [...acc, [processedComponents[key]!, customProps]];
      }
      return [...acc, [processedComponents[key]!, {}]];
    }, []);
  }, [preProcessedItems, processedComponents, processedComponentsProps]);
};

export { useGridColumnMenuComponents };
