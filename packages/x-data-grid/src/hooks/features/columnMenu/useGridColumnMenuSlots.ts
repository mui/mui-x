import * as React from 'react';
import type { GridColumnMenuRootProps } from './columnMenuInterfaces';
import type { GridColDef } from '../../../models/colDef/gridColDef';
import { useGridRootProps } from '../../utils/useGridRootProps';
import { useGridPrivateApiContext } from '../../utils/useGridPrivateApiContext';
import { getColumnMenuItemKeys } from './getColumnMenuItemKeys';

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
  const rootProps = useGridRootProps();
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

  return React.useMemo(() => {
    const sortedKeys = getColumnMenuItemKeys({
      apiRef,
      colDef,
      defaultSlots,
      defaultSlotProps,
      slots,
      slotProps,
    });

    return sortedKeys.reduce<UseGridColumnMenuSlotsResponse>((acc, key, index) => {
      let itemProps = { colDef, onClick: hideMenu };
      const processedComponentProps = processedSlotProps[key];
      if (processedComponentProps) {
        const { displayOrder, ...customProps } = processedComponentProps;
        itemProps = { ...itemProps, ...customProps };
      }
      return addDividers && index !== sortedKeys.length - 1
        ? [...acc, [processedComponents[key]!, itemProps], [rootProps.slots.baseDivider, {}]]
        : [...acc, [processedComponents[key]!, itemProps]];
    }, []);
  }, [
    addDividers,
    apiRef,
    colDef,
    defaultSlotProps,
    defaultSlots,
    hideMenu,
    processedComponents,
    processedSlotProps,
    slotProps,
    slots,
    rootProps.slots.baseDivider,
  ]);
};

export { useGridColumnMenuSlots };
