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

export const leafItemGroups: {
  parentPath: string;
  leafItems: TreeViewBaseItem<{
    itemType: ItemType;
    id: string;
    label: string;
    code: string;
    language: string;
  }>[];
}[] = [
  {
    parentPath: 'docs/data/migration/migration-pickers-v7',
    leafItems: [
      {
        id: '1.1',
        label: 'migration-pickers-v7.md',
        itemType: 'modified',
        code: '# Migration from v7 to v8\n\n<p class="description">This guide describes the changes needed to migrate the Date and Time Pickers from v7 to v8.</p>\n\n## Introduction\nThis is a reference guide for upgrading `@mui/x-date-pickers` from v7 to v8.\n\n## Start using the new release\n\nIn `package.json`, change the version of the date pickers package to `next`.',
        language: 'js',
      },
    ],
  },
  {
    parentPath: 'packages/x-date-pickers-pro/src/DateRangeCalendar',
    leafItems: [
      {
        id: '2.1.1',
        label: 'DateRangeCalendar.tsx',
        itemType: 'added',
        code: "const DateRangeCalendar = React.forwardRef(function DateRangeCalendar(\n  inProps: DateRangeCalendarProps,\n  ref: React.Ref<HTMLDivElement>,\n) {\n  const props = useDateRangeCalendarDefaultizedProps(inProps, 'MuiDateRangeCalendar');\n  const shouldHavePreview = useMediaQuery(DEFAULT_DESKTOP_MODE_MEDIA_QUERY, {\n    defaultMatches: false,\n  });",
        language: 'tsx',
      },
      {
        id: '2.1.2',
        label: 'DateRangeCalendar.test.tsx',
        itemType: 'modified',
        code: "  describe('Selection', () => {\nit('should select the range from the next month', () => {\n  const onChange = spy();\n  render(\n    <DateRangeCalendar\n      onChange={onChange}\n      defaultValue={[adapterToUse.date('2019-01-01'), null]}\n    />,\n  );",
        language: 'ts',
      },
    ],
  },
  {
    parentPath: 'packages/x-date-pickers-pro/src/DateRangePicker',
    leafItems: [
      {
        id: '2.2.1',
        label: 'DateRangePicker.tsx',
        itemType: 'deleted',
        code: '  if (isDesktop) {\n  return <DesktopDateRangePicker ref={ref} {...other} />;\n}\nreturn <MobileDateRangePicker ref={ref} {...other} />;',
        language: 'js',
      },
    ],
  },
  {
    parentPath: 'packages/x-date-pickers-pro/src/DateTimeRangePicker',
    leafItems: [
      {
        id: '2.3.1',
        label: 'DateTimeRangePickerTabs.tsx',
        itemType: 'modified',
        code: "const viewToTab = (view: DateOrTimeViewWithMeridiem, rangePosition: RangePosition): TabValue => {\n  if (isDatePickerView(view)) {\n    return rangePosition === 'start' ? 'start-date' : 'end-date';\n  }\n  return rangePosition === 'start' ? 'start-time' : 'end-time';\n};",
        language: 'js',
      },
      {
        id: '2.3.2',
        label: 'DateTimeRangePickerToolbar.tsx',
        itemType: 'added',
        code: 'export interface ExportedDateTimeRangePickerToolbarProps extends ExportedBaseToolbarProps {\n  /**\n   * Override or extend the styles applied to the component.\n   */\n  classes?: Partial<DateTimeRangePickerToolbarClasses>;\n}',
        language: 'js',
      },
    ],
  },
  {
    parentPath: 'internals/hooks/models',
    leafItems: [
      {
        id: '3.1.1',
        label: 'index.ts',
        itemType: 'modified',
        code: 'export type { UseRangePickerSlots }',
        language: 'ts',
      },
      {
        id: '3.1.2',
        label: 'useRangePicker.ts',
        itemType: 'modified',
        code: 'export interface UseRangePickerSlots\nextends ExportedPickersLayoutSlots<PickerRangeValue>,\n  RangePickerFieldSlots {}',
        language: 'ts',
      },
    ],
  },
  {
    parentPath: 'internals/hooks',
    leafItems: [
      {
        id: '3.2',
        label: 'useEnrichedRangePickerField.ts',
        itemType: 'added',
        code: "const handleFocusEnd = () => {\n  if (contextValue.open) {\n    setRangePosition('end');\n    if (previousRangePosition.current !== 'end' && initialView) {\n      contextValue.setView?.(initialView);\n    }\n  }\n};",
        language: 'js',
      },
      {
        id: '3.3',
        label: 'useRangePosition.tsx',
        itemType: 'modified',
        code: '    const sections = singleInputFieldRef.current.getSections();',
        language: 'js',
      },
    ],
  },
];
