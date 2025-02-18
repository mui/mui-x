import { TreeViewBaseItem } from '@mui/x-tree-view/models';

export type ItemType = 'added' | 'deleted' | 'modified';

export type ExtendedTreeItemProps = {
  itemType?: ItemType;
  id: string;
  label: string;
};

export const ITEMS: TreeViewBaseItem<ExtendedTreeItemProps>[] = [
  {
    id: '1',
    label: 'docs/data/migration/migration-pickers-v7',
    children: [
      {
        id: '1.1',
        label: 'migration-pickers-v7.md',
        itemType: 'modified',
      },
    ],
  },
  {
    id: '2',
    label: 'packages/x-date-pickers-pro/src',
    children: [
      {
        id: '2.1',
        label: 'DateRangeCalendar',
        children: [
          {
            id: '2.1.1',
            label: 'DateRangeCalendar.tsx',
            itemType: 'added',
          },
          {
            id: '2.1.2',
            label: 'DateRangeCalendar.test.tsx',
            itemType: 'modified',
          },
        ],
      },
      {
        id: '2.2',
        label: 'DateRangePicker',
        children: [
          {
            id: '2.2.1',
            label: 'DateRangePicker.tsx',
            itemType: 'deleted',
          },
        ],
      },
      {
        id: '2.3',
        label: 'DateTimeRangePicker',
        children: [
          {
            id: '2.3.1',
            label: 'DateTimeRangePickerTabs.tsx',
            itemType: 'modified',
          },
          {
            id: '2.3.2',
            label: 'DateTimeRangePickerToolbar.tsx',
            itemType: 'added',
          },
        ],
      },
    ],
  },
  {
    id: '3',
    label: 'internals/hooks',
    children: [
      {
        id: '3.1',
        label: 'models',
        children: [
          {
            id: '3.1.1',
            label: 'index.ts',
            itemType: 'modified',
          },
          {
            id: '3.1.2',
            label: 'useRangePicker.ts',
            itemType: 'modified',
          },
        ],
      },
      {
        id: '3.2',
        label: 'useEnrichedRangePickerField.ts',
        itemType: 'added',
      },
      {
        id: '3.3',
        label: 'useRangePosition.tsx',
        itemType: 'modified',
      },
    ],
  },
];
