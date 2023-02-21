import * as React from 'react';
import Divider from '@mui/material/Divider';
import { GridColumnMenuRootProps } from './columnMenuInterfaces';
import { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';

interface UseGridColumnMenuSlotsProps extends GridColumnMenuRootProps {
  colDef: GridColDef;
  hideMenu: (event: React.SyntheticEvent) => void;
  addDividers?: boolean;
}

type UseGridColumnMenuSlotsResponse = Array<
  [React.JSXElementConstructor<any>, { [key: string]: any }]
>;

const useGridColumnMenuSlots = (props: UseGridColumnMenuSlotsProps) => {
  const apiRef = useGridPrivateApiContext();
  const {
    defaultSlots,
    defaultSlotProps,
    slots = {},
    slotProps = {},
    hideMenu,
    colDef,
    addDividers = true,
  } = props;

  const processedComponents = React.useMemo(
    () => ({ ...defaultSlots, ...slots }),
    [defaultSlots, slots],
  );

  const processedSlotProps = React.useMemo(() => {
    if (!slotProps || Object.keys(slotProps).length === 0) {
      return defaultSlotProps;
    }
    const mergedProps = { ...slotProps } as typeof defaultSlotProps;
    Object.entries(defaultSlotProps).forEach(([key, currentSlotProps]) => {
      mergedProps[key] = { ...currentSlotProps, ...(slotProps[key] || {}) };
    });
    return mergedProps;
  }, [defaultSlotProps, slotProps]);

  const defaultItems = apiRef.current.unstable_applyPipeProcessors('columnMenu', [], props.colDef);

  const userItems = React.useMemo(() => {
    const defaultComponentKeys = Object.keys(defaultSlots);
    return Object.keys(slots).filter((key) => !defaultComponentKeys.includes(key));
  }, [slots, defaultSlots]);

  return React.useMemo(() => {
    const uniqueItems = Array.from(new Set<string>([...defaultItems, ...userItems]));
    const cleansedItems = uniqueItems.filter((key) => processedComponents[key] != null);
    const sorted = cleansedItems.sort((a, b) => {
      const leftItemProps = processedSlotProps[a];
      const rightItemProps = processedSlotProps[b];
      const leftDisplayOrder = Number.isFinite(leftItemProps?.displayOrder)
        ? leftItemProps.displayOrder
        : 100;
      const rightDisplayOrder = Number.isFinite(rightItemProps?.displayOrder)
        ? rightItemProps.displayOrder
        : 100;
      return leftDisplayOrder! - rightDisplayOrder!;
    });
    return sorted.reduce<UseGridColumnMenuSlotsResponse>((acc, key, index) => {
      let itemProps = { colDef, onClick: hideMenu };
      const processedComponentProps = processedSlotProps[key];
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
    processedSlotProps,
    userItems,
  ]);
};

export { useGridColumnMenuSlots };
