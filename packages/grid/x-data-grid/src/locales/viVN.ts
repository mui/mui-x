import { viVN as viVNCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const viVNGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Không có dữ liệu',
  noResultsOverlayLabel: 'Không tìm thấy kết quả.',

  // Density selector toolbar button text
  toolbarDensity: 'Độ giãn',
  toolbarDensityLabel: 'Độ giãn',
  toolbarDensityCompact: 'Trung bình',
  toolbarDensityStandard: 'Tiêu chuẩn',
  toolbarDensityComfortable: 'Rộng',

  // Columns selector toolbar button text
  toolbarColumns: 'Cột',
  toolbarColumnsLabel: 'Chọn cột',

  // Filters toolbar button text
  toolbarFilters: 'Bộ lọc',
  toolbarFiltersLabel: 'Hiển thị bộ lọc',
  toolbarFiltersTooltipHide: 'Ẩn',
  toolbarFiltersTooltipShow: 'Hiện',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} bộ lọc hoạt động` : `${count} bộ lọc hoạt động`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Tìm kiếm…',
  toolbarQuickFilterLabel: 'Tìm kiếm',
  toolbarQuickFilterDeleteIconLabel: 'Xóa tìm kiếm',

  // Export selector toolbar button text
  toolbarExport: 'Xuất',
  toolbarExportLabel: 'Xuất',
  toolbarExportCSV: 'Xuất CSV',
  toolbarExportPrint: 'In',
  toolbarExportExcel: 'Xuất Excel',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Tìm kiếm',
  columnsPanelTextFieldPlaceholder: 'Tiêu đề cột',
  columnsPanelDragIconLabel: 'Sắp xếp',
  columnsPanelShowAllButton: 'Hiện tất cả',
  columnsPanelHideAllButton: 'Ẩn tất cả',

  // Filter panel text
  filterPanelAddFilter: 'Thêm bộ lọc',
  // filterPanelRemoveAll: 'Remove all',
  filterPanelDeleteIconLabel: 'Xóa',
  filterPanelLogicOperator: 'Toán tử logic',
  filterPanelOperator: 'Toán tử',
  filterPanelOperatorAnd: 'Và',
  filterPanelOperatorOr: 'Hoặc',
  filterPanelColumns: 'Cột',
  filterPanelInputLabel: 'Giá trị',
  filterPanelInputPlaceholder: 'Lọc giá trị',

  // Filter operators text
  filterOperatorContains: 'Chứa',
  filterOperatorEquals: 'Bằng',
  filterOperatorStartsWith: 'Bắt đầu bằng',
  filterOperatorEndsWith: 'Kết thúc bằng',
  filterOperatorIs: 'Là',
  filterOperatorNot: 'Không là',
  filterOperatorAfter: 'Trước',
  filterOperatorOnOrAfter: 'bằng hoặc sau',
  filterOperatorBefore: 'Sau',
  filterOperatorOnOrBefore: 'bằng hoặc trước',
  filterOperatorIsEmpty: 'Rỗng',
  filterOperatorIsNotEmpty: 'Khác rỗng',
  // filterOperatorIsAnyOf: 'is any of',
  // 'filterOperator=': '=',
  // 'filterOperator!=': '!=',
  // 'filterOperator>': '>',
  // 'filterOperator>=': '>=',
  // 'filterOperator<': '<',
  // 'filterOperator<=': '<=',

  // Header filter operators text
  // headerFilterOperatorContains: 'Contains',
  // headerFilterOperatorEquals: 'Equals',
  // headerFilterOperatorStartsWith: 'Starts with',
  // headerFilterOperatorEndsWith: 'Ends with',
  // headerFilterOperatorIs: 'Is',
  // headerFilterOperatorNot: 'Is not',
  // headerFilterOperatorAfter: 'Is after',
  // headerFilterOperatorOnOrAfter: 'Is on or after',
  // headerFilterOperatorBefore: 'Is before',
  // headerFilterOperatorOnOrBefore: 'Is on or before',
  // headerFilterOperatorIsEmpty: 'Is empty',
  // headerFilterOperatorIsNotEmpty: 'Is not empty',
  // headerFilterOperatorIsAnyOf: 'Is any of',
  // 'headerFilterOperator=': 'Equals',
  // 'headerFilterOperator!=': 'Not equals',
  // 'headerFilterOperator>': 'Greater than',
  // 'headerFilterOperator>=': 'Greater than or equal to',
  // 'headerFilterOperator<': 'Less than',
  // 'headerFilterOperator<=': 'Less than or equal to',

  // Filter values text
  filterValueAny: 'bất kỳ giá trị nào',
  filterValueTrue: 'Có',
  filterValueFalse: 'Không',

  // Column menu text
  columnMenuLabel: 'Danh mục',
  columnMenuShowColumns: 'Danh sách cột',
  // columnMenuManageColumns: 'Manage columns',
  columnMenuFilter: 'Bộ lọc',
  columnMenuHideColumn: 'Ẩn cột',
  columnMenuUnsort: 'Bỏ sắp xếp',
  columnMenuSortAsc: 'Sắp xếp tăng dần',
  columnMenuSortDesc: 'Sắp xếp giảm dần',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} bộ lọc hoạt động` : `${count} bộ lọc hoạt động`,
  columnHeaderFiltersLabel: 'Bộ lọc',
  columnHeaderSortIconLabel: 'Sắp xếp',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1 ? `${count.toLocaleString()} hàng đã chọn` : `${count.toLocaleString()} hàng đã chọn`,

  // Total row amount footer text
  footerTotalRows: 'Tổng:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Tích vào ô trống',
  checkboxSelectionSelectAllRows: 'Chọn tất cả hàng',
  checkboxSelectionUnselectAllRows: 'Bỏ chọn tất cả hàng',
  checkboxSelectionSelectRow: 'Chọn hàng',
  checkboxSelectionUnselectRow: 'Bỏ chọn hàng',

  // Boolean cell text
  booleanCellTrueLabel: 'Có',
  booleanCellFalseLabel: 'Không',

  // Actions cell more text
  actionsCellMore: 'Thêm',

  // Column pinning text
  pinToLeft: 'Ghim cột bên trái',
  pinToRight: 'Ghim cột bên phải',
  unpin: 'Bỏ ghim',

  // Tree Data
  treeDataGroupingHeaderName: 'Nhóm',
  treeDataExpand: 'mở rộng',
  treeDataCollapse: 'ẩn đi',

  // Grouping columns
  groupingColumnHeaderName: 'Nhóm',
  groupColumn: (name) => `Nhóm theo ${name}`,
  unGroupColumn: (name) => `Hủy nhóm theo ${name}`,

  // Master/detail
  detailPanelToggle: 'Ẩn/hiện chi tiết',
  expandDetailPanel: 'Mở rộng',
  collapseDetailPanel: 'Thu nhỏ',

  // Row reordering text
  rowReorderingHeaderName: 'Sắp xếp hàng',

  // Aggregation
  // aggregationMenuItemHeader: 'Aggregation',
  // aggregationFunctionLabelSum: 'sum',
  // aggregationFunctionLabelAvg: 'avg',
  // aggregationFunctionLabelMin: 'min',
  // aggregationFunctionLabelMax: 'max',
  // aggregationFunctionLabelSize: 'size',
};

export const viVN: Localization = getGridLocalization(viVNGrid, viVNCore);
