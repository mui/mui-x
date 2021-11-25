import { zhCN as zhCNCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const zhCNGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: '没有数据。',
  noResultsOverlayLabel: '未找到数据。',
  errorOverlayDefaultLabel: '发生错误。',

  // Density selector toolbar button text
  toolbarDensity: '表格密度',
  toolbarDensityLabel: '表格密度',
  toolbarDensityCompact: '紧密',
  toolbarDensityStandard: '标准',
  toolbarDensityComfortable: '稀疏',

  // Columns selector toolbar button text
  toolbarColumns: '列',
  toolbarColumnsLabel: '选择列',

  // Filters toolbar button text
  toolbarFilters: '筛选器',
  toolbarFiltersLabel: '显示筛选器',
  toolbarFiltersTooltipHide: '隐藏筛选器',
  toolbarFiltersTooltipShow: '显示筛选器',
  toolbarFiltersTooltipActive: (count) => `${count} 个筛选器`,

  // Export selector toolbar button text
  toolbarExport: '导出',
  toolbarExportLabel: '导出',
  toolbarExportCSV: '导出至CSV',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: '搜索列',
  columnsPanelTextFieldPlaceholder: '列名',
  columnsPanelDragIconLabel: '重排序列',
  columnsPanelShowAllButton: '显示所有',
  columnsPanelHideAllButton: '隐藏所有',

  // Filter panel text
  filterPanelAddFilter: '添加筛选器',
  filterPanelDeleteIconLabel: '删除',
  filterPanelOperators: '操作器',
  filterPanelOperatorAnd: '与',
  filterPanelOperatorOr: '或',
  filterPanelColumns: '列',
  filterPanelInputLabel: '值',
  filterPanelInputPlaceholder: '筛选值',

  // Filter operators text
  filterOperatorContains: '包含',
  filterOperatorEquals: '等于',
  filterOperatorStartsWith: '开始于',
  filterOperatorEndsWith: '结束于',
  filterOperatorIs: '是',
  filterOperatorNot: '不是',
  filterOperatorAfter: '在后面',
  filterOperatorOnOrAfter: '正在后面',
  filterOperatorBefore: '在前面',
  filterOperatorOnOrBefore: '正在前面',
  filterOperatorIsEmpty: '为空',
  filterOperatorIsNotEmpty: '不为空',

  // Filter values text
  filterValueAny: '任何',
  filterValueTrue: '真',
  filterValueFalse: '假',

  // Column menu text
  columnMenuLabel: '菜单',
  columnMenuShowColumns: '显示',
  columnMenuFilter: '筛选器',
  columnMenuHideColumn: '隐藏',
  columnMenuUnsort: '恢复默认',
  columnMenuSortAsc: '升序',
  columnMenuSortDesc: '降序',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count !== 1 ? `${count} 个筛选器` : `${count} 个筛选器`,
  columnHeaderFiltersLabel: '显示筛选器',
  columnHeaderSortIconLabel: '排序',

  // Rows selected footer text
  footerRowSelected: (count) => `共选中了${count.toLocaleString()}行`,

  // Total rows footer text
  footerTotalRows: '所有行:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: '多选框',

  // Boolean cell text
  booleanCellTrueLabel: '真',
  booleanCellFalseLabel: '假',

  // Actions cell more text
  // actionsCellMore: 'more',

  // Column pinning text
  // pinToLeft: 'Pin to left',
  // pinToRight: 'Pin to right',
  // unpin: 'Unpin',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',
};

export const zhCN: Localization = getGridLocalization(zhCNGrid, zhCNCore);
