'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { checkboxClasses } from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import { useStore } from '@base-ui/utils/store';
import { useStableCallback } from '@base-ui/utils/useStableCallback';
import { useEventCalendarStoreContext } from '@mui/x-scheduler-internals/use-event-calendar-store-context';
import { schedulerResourceSelectors } from '@mui/x-scheduler-internals/scheduler-selectors';
import { SchedulerResource } from '@mui/x-scheduler-internals/models';
import { RichTreeView } from '@mui/x-tree-view/RichTreeView';
import { TreeItem, treeItemClasses, TreeItemProps } from '@mui/x-tree-view/TreeItem';
import { useRichTreeViewApiRef } from '@mui/x-tree-view/hooks';
import clsx from 'clsx';
import { ResourcesTreeProps } from './ResourcesTree.types';
import { getPaletteVariants } from '../../internals/utils/tokens';
import { useEventCalendarStyledContext } from '../EventCalendarStyledContext';

const ResourcesTreeRoot = styled('section', {
  name: 'MuiEventCalendar',
  slot: 'ResourcesTree',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(1),
  overflowY: 'auto',
  scrollbarWidth: 'thin',
  [`&[data-flat] .${treeItemClasses.iconContainer}`]: {
    display: 'none',
  },
}));

const ResourcesTreeLabel = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesTreeLabel',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  fontWeight: theme.typography.fontWeightMedium,
  paddingLeft: theme.spacing(1.25),
  paddingBottom: theme.spacing(1),
}));

const ResourcesTreeItemRoot = styled(TreeItem, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesTreeItem',
})(({ theme }) => ({
  [`& .${treeItemClasses.content}[data-selected]`]: {
    backgroundColor: 'transparent',
    '&:hover': {
      backgroundColor: (theme.vars || theme).palette.action.hover,
      '@media (hover: none)': {
        backgroundColor: 'transparent',
      },
    },
    '&[data-focused]': {
      backgroundColor: (theme.vars || theme).palette.action.focus,
    },
  },
  [`& .${checkboxClasses.root}`]: {
    color: 'var(--event-main)',
    [`&.${checkboxClasses.checked}`]: {
      color: 'var(--event-main)',
    },
  },
  variants: getPaletteVariants(theme),
}));

const ResourcesTreeItemLabel = styled(Typography, {
  name: 'MuiEventCalendar',
  slot: 'ResourcesTreeItemLabel',
})(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
}));

const getItemLabel = (item: SchedulerResource) => item.title;

function ResourcesTreeItem(props: TreeItemProps) {
  const { itemId, label, ...other } = props;
  const { classes } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const eventColor = useStore(store, schedulerResourceSelectors.defaultEventColor, itemId);

  return (
    <ResourcesTreeItemRoot
      itemId={itemId}
      label={
        <ResourcesTreeItemLabel className={classes.resourcesTreeItemLabel}>
          {label}
        </ResourcesTreeItemLabel>
      }
      data-palette={eventColor}
      className={classes.resourcesTreeItem}
      slotProps={
        {
          checkbox: {
            className: classes.resourcesTreeItemCheckbox,
            size: 'small',
            slotProps: { input: { tabIndex: -1 } },
          },
        } as TreeItemProps['slotProps']
      }
      {...other}
    />
  );
}

export const ResourcesTree = React.forwardRef(function ResourcesTree(
  props: ResourcesTreeProps,
  forwardedRef: React.ForwardedRef<HTMLElement>,
) {
  const { classes, localeText } = useEventCalendarStyledContext();
  const store = useEventCalendarStoreContext();
  const apiRef = useRichTreeViewApiRef();
  const headingId = React.useId();
  const resources = useStore(store, schedulerResourceSelectors.processedResourceList);
  const childrenLookup = useStore(
    store,
    schedulerResourceSelectors.processedResourceChildrenLookup,
  );
  const flatList = useStore(store, schedulerResourceSelectors.processedResourceFlatList);
  const visibleMap = useStore(store, schedulerResourceSelectors.visibleMap);

  const getItemChildren = React.useCallback(
    (item: SchedulerResource) => childrenLookup.get(item.id) ?? [],
    [childrenLookup],
  );

  const selectedItems = React.useMemo(() => {
    // A resource is "fully selected" only if itself and every descendant are visible.
    const fullyVisible = new Set<string>();
    for (let i = flatList.length - 1; i >= 0; i -= 1) {
      const resource = flatList[i];
      if (visibleMap[resource.id] === false) {
        continue;
      }
      const children = childrenLookup.get(resource.id);
      if (!children || children.every((child) => fullyVisible.has(child.id))) {
        fullyVisible.add(resource.id);
      }
    }
    return flatList.filter((r) => fullyVisible.has(r.id)).map((r) => r.id);
  }, [flatList, visibleMap, childrenLookup]);

  const defaultExpandedItems = React.useMemo(
    () => Array.from(childrenLookup.keys()),
    [childrenLookup],
  );

  const handleSelectedItemsChange = useStableCallback(
    (event: React.SyntheticEvent | null, newSelectedIds: string[]) => {
      const newSelected = new Set(newSelectedIds);
      const newVisibleResources: Record<string, boolean> = {};
      // Walk in reverse (leaves before parents) so a parent is marked visible when any descendant is selected, even if the parent itself was removed.
      for (let i = flatList.length - 1; i >= 0; i -= 1) {
        const resource = flatList[i];
        if (newSelected.has(resource.id)) {
          newVisibleResources[resource.id] = true;
          continue;
        }
        const children = childrenLookup.get(resource.id);
        const hasVisibleDescendant = children?.some(
          (child) => newVisibleResources[child.id] === true,
        );
        newVisibleResources[resource.id] = hasVisibleDescendant ?? false;
      }
      store.setVisibleResources(newVisibleResources, event?.nativeEvent);
    },
  );

  const handleItemClick = useStableCallback((event: React.MouseEvent, itemId: string) => {
    // Clicks already handled by the checkbox or the expand-collapse icon must not double-toggle.
    const target = event.target as HTMLElement;
    if (
      target.closest(`.${treeItemClasses.checkbox}`) ||
      target.closest(`.${treeItemClasses.iconContainer}`)
    ) {
      return;
    }
    apiRef.current?.setItemSelection({
      event,
      itemId,
      keepExistingSelection: true,
    });
  });

  if (resources.length === 0) {
    return null;
  }

  const isFlat = childrenLookup.size === 0;

  return (
    <ResourcesTreeRoot
      ref={forwardedRef}
      {...props}
      className={clsx(props.className, classes.resourcesTree)}
      data-flat={isFlat || undefined}
    >
      <ResourcesTreeLabel id={headingId} className={classes.resourcesTreeLabel}>
        {localeText.resourcesLabel}
      </ResourcesTreeLabel>
      <RichTreeView<SchedulerResource, true>
        items={resources}
        apiRef={apiRef}
        getItemChildren={getItemChildren}
        getItemLabel={getItemLabel}
        multiSelect
        checkboxSelection
        selectionPropagation={{ parents: true, descendants: true }}
        expansionTrigger="iconContainer"
        selectedItems={selectedItems}
        defaultExpandedItems={defaultExpandedItems}
        onSelectedItemsChange={handleSelectedItemsChange}
        onItemClick={handleItemClick}
        slots={{ item: ResourcesTreeItem }}
        aria-labelledby={headingId}
      />
    </ResourcesTreeRoot>
  );
});
