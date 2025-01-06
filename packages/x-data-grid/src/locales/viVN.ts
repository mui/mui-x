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

  // Prompt toolbar field
  // toolbarPromptControlPlaceholder: 'Type a prompt…',
  // toolbarPromptControlWithRecordingPlaceholder: 'Type or record a prompt…',
  // toolbarPromptControlRecordingPlaceholder: 'Listening for prompt…',
  // toolbarPromptControlLabel: 'Prompt input',
  // toolbarPromptControlRecordButtonDefaultLabel: 'Record',
  // toolbarPromptControlRecordButtonActiveLabel: 'Stop recording',
  // toolbarPromptControlSendActionLabel: 'Send',
  // toolbarPromptControlSendActionAriaLabel: 'Send prompt',
  // toolbarPromptControlErrorMessage: 'An error occurred while processing the request. Please try again with a different prompt.',

  // Export selector toolbar button text
  toolbarExport: 'Xuất',
  toolbarExportLabel: 'Xuất',
  toolbarExportCSV: 'Xuất CSV',
  toolbarExportPrint: 'In',
  toolbarExportExcel: 'Xuất Excel',

  // Columns management text
  columnsManagementSearchTitle: 'Tìm kiếm',
  columnsManagementNoColumns: 'Không có cột',
  columnsManagementShowHideAllText: 'Hiện/Ẩn Tất cả',
  columnsManagementReset: 'Đặt lại',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Thêm bộ lọc',
  filterPanelRemoveAll: 'Xóa tất cả',
  filterPanelDeleteIconLabel: 'Xóa',
  filterPanelLogicOperator: 'Toán tử logic',
  filterPanelOperator: 'Toán tử',
  filterPanelOperatorAnd: 'Và',
  filterPanelOperatorOr: 'Hoặc',
  filterPanelColumns: 'Cột',
  filterPanelInputLabel: 'Giá trị',
  filterPanelInputPlaceholder: 'Lọc giá trị',

  // Filter operators text
  filterOperatorContains: 'chứa',
  filterOperatorDoesNotContain: 'không chứa',
  filterOperatorEquals: 'bằng',
  filterOperatorDoesNotEqual: 'không bằng',
  filterOperatorStartsWith: 'bắt đầu với',
  filterOperatorEndsWith: 'kết thúc với',
  filterOperatorIs: 'là',
  filterOperatorNot: 'không phải là',
  filterOperatorAfter: 'sau',
  filterOperatorOnOrAfter: 'bằng hoặc sau',
  filterOperatorBefore: 'trước',
  filterOperatorOnOrBefore: 'bằng hoặc trước',
  filterOperatorIsEmpty: 'rỗng',
  filterOperatorIsNotEmpty: 'khác rỗng',
  filterOperatorIsAnyOf: 'là một trong',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Chứa',
  headerFilterOperatorDoesNotContain: 'Không chứa',
  headerFilterOperatorEquals: 'Bằng',
  headerFilterOperatorDoesNotEqual: 'Không bằng',
  headerFilterOperatorStartsWith: 'Bắt đầu với',
  headerFilterOperatorEndsWith: 'Kết thúc với',
  headerFilterOperatorIs: 'Là',
  headerFilterOperatorNot: 'Không phải là',
  headerFilterOperatorAfter: 'Sau',
  headerFilterOperatorOnOrAfter: 'Bằng hoặc sau',
  headerFilterOperatorBefore: 'Trước',
  headerFilterOperatorOnOrBefore: 'Bằng hoặc trước',
  headerFilterOperatorIsEmpty: 'Rỗng',
  headerFilterOperatorIsNotEmpty: 'Khác rỗng',
  headerFilterOperatorIsAnyOf: 'Là một trong',
  'headerFilterOperator=': 'Bằng',
  'headerFilterOperator!=': 'Khác',
  'headerFilterOperator>': 'Lớn hơn',
  'headerFilterOperator>=': 'Lớn hơn hoặc bằng',
  'headerFilterOperator<': 'Nhỏ hơn',
  'headerFilterOperator<=': 'Nhỏ hơn hoặc bằng',

  // Filter values text
  filterValueAny: 'bất kỳ giá trị nào',
  filterValueTrue: 'Có',
  filterValueFalse: 'Không',

  // Column menu text
  columnMenuLabel: 'Danh mục',
  columnMenuShowColumns: 'Danh sách cột',
  columnMenuManageColumns: 'Quản lý cột',
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
  aggregationMenuItemHeader: 'Tổng hợp',
  aggregationFunctionLabelSum: 'Tổng',
  aggregationFunctionLabelAvg: 'Trung bình',
  aggregationFunctionLabelMin: 'Tối thiểu',
  aggregationFunctionLabelMax: 'Tối đa',
  aggregationFunctionLabelSize: 'Kích cỡ',
};

export const viVN: Localization = getGridLocalization(viVNGrid, viVNCore);
