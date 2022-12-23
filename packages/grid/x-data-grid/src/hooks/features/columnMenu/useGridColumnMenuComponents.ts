import * as React from 'react';
import Divider from '@mui/material/Divider';
import { GridColumnMenuRootProps } from './columnMenuInterfaces';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';

interface UseGridColumnMenuComponentsProps extends GridColumnMenuRootProps {
  colDef: GridColDef;
  hideMenu: (event: React.SyntheticEvent) => void;
  addDividers?: boolean;
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
    hideMenu,
    colDef,
    addDividers = true,
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

  const defaultItems = apiRef.current.unstable_applyPipeProcessors('columnMenu', [], props.colDef);

  const userItems = React.useMemo(() => {
    const defaultComponentKeys = Object.keys(defaultComponents);
    return Object.keys(components).filter((key) => !defaultComponentKeys.includes(key));
  }, [components, defaultComponents]);

  return React.useMemo(() => {
    const uniqueItems = Array.from(new Set<string>([...defaultItems, ...userItems]));
    const cleansedItems = uniqueItems.filter((key) => processedComponents[key] != null);
    const sorted = cleansedItems.sort((a, b) => {
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
    return sorted.reduce<UseGridColumnMenuComponentsResponse>((acc, key, index) => {
      let itemProps = { colDef, onClick: hideMenu };
      const processedComponentProps = processedComponentsProps[camelize(key)];
      if (processedComponentProps) {
        const { displayOrder, ...customProps } = processedComponentProps;
        itemProps = { ...itemProps, ...customProps };
      }
      return addDividers && index !== sorted.length - 1
        ? [...acc, [processedComponents[key]!, itemProps], [Divider, {}]]
        : [...acc, [processedComponents[key]!, itemProps]];
    }, []);
  }, [
    addDividers,
    colDef,
    defaultItems,
    hideMenu,
    processedComponents,
    processedComponentsProps,
    userItems,
  ]);
};

export { useGridColumnMenuComponents };
