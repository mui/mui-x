import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import {
  getGridLocalization,
  type Localization,
  buildLocaleFormat,
} from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('th-TH');

const thTHGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'ไม่มีข้อมูล',
  noResultsOverlayLabel: 'ไม่พบผลลัพธ์',
  noColumnsOverlayLabel: 'ไม่มีคอลัมน์',
  noColumnsOverlayManageColumns: 'จัดการคอลัมน์',
  emptyPivotOverlayLabel: 'เพิ่มฟิลด์ไปยังแถว คอลัมน์ และค่า เพื่อสร้างตาราง Pivot',

  // Density selector toolbar button text
  toolbarDensity: 'ความหนาแน่น',
  toolbarDensityLabel: 'ความหนาแน่น',
  toolbarDensityCompact: 'กะทัดรัด',
  toolbarDensityStandard: 'มาตรฐาน',
  toolbarDensityComfortable: 'สบายตา',

  // Undo/redo toolbar button text
  toolbarUndo: 'เลิกทำ',
  toolbarRedo: 'ทำซ้ำ',

  // Columns selector toolbar button text
  toolbarColumns: 'คอลัมน์',
  toolbarColumnsLabel: 'เลือกคอลัมน์',

  // Filters toolbar button text
  toolbarFilters: 'ตัวกรอง',
  toolbarFiltersLabel: 'แสดงตัวกรอง',
  toolbarFiltersTooltipHide: 'ซ่อนตัวกรอง',
  toolbarFiltersTooltipShow: 'แสดงตัวกรอง',
  toolbarFiltersTooltipActive: (count) => `ตัวกรองที่ใช้งาน ${count} รายการ`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'ค้นหา…',
  toolbarQuickFilterLabel: 'ค้นหา',
  toolbarQuickFilterDeleteIconLabel: 'ล้าง',

  // Export selector toolbar button text
  toolbarExport: 'ส่งออก',
  toolbarExportLabel: 'ส่งออก',
  toolbarExportCSV: 'ดาวน์โหลดเป็น CSV',
  toolbarExportPrint: 'พิมพ์',
  toolbarExportExcel: 'ดาวน์โหลดเป็น Excel',

  // Toolbar pivot button
  toolbarPivot: 'Pivot',

  // Toolbar charts button
  toolbarCharts: 'แผนภูมิ',

  // Toolbar AI Assistant button
  toolbarAssistant: 'ผู้ช่วย AI',

  // Columns management text
  columnsManagementSearchTitle: 'ค้นหา',
  columnsManagementNoColumns: 'ไม่มีคอลัมน์',
  columnsManagementShowHideAllText: 'แสดง/ซ่อนทั้งหมด',
  columnsManagementReset: 'รีเซ็ต',
  columnsManagementDeleteIconLabel: 'ล้าง',

  // Filter panel text
  filterPanelAddFilter: 'เพิ่มตัวกรอง',
  filterPanelRemoveAll: 'ลบทั้งหมด',
  filterPanelDeleteIconLabel: 'ลบ',
  filterPanelLogicOperator: 'ตัวดำเนินการตรรกะ',
  filterPanelOperator: 'ตัวดำเนินการ',
  filterPanelOperatorAnd: 'และ',
  filterPanelOperatorOr: 'หรือ',
  filterPanelColumns: 'คอลัมน์',
  filterPanelInputLabel: 'ค่า',
  filterPanelInputPlaceholder: 'ค่าตัวกรอง',

  // Filter operators text
  filterOperatorContains: 'ประกอบด้วย',
  filterOperatorDoesNotContain: 'ไม่ประกอบด้วย',
  filterOperatorEquals: 'เท่ากับ',
  filterOperatorDoesNotEqual: 'ไม่เท่ากับ',
  filterOperatorStartsWith: 'เริ่มต้นด้วย',
  filterOperatorEndsWith: 'ลงท้ายด้วย',
  filterOperatorIs: 'คือ',
  filterOperatorNot: 'ไม่ใช่',
  filterOperatorAfter: 'หลังจาก',
  filterOperatorOnOrAfter: 'ตั้งแต่หรือหลังจาก',
  filterOperatorBefore: 'ก่อน',
  filterOperatorOnOrBefore: 'ตั้งแต่หรือก่อน',
  filterOperatorIsEmpty: 'ว่างเปล่า',
  filterOperatorIsNotEmpty: 'ไม่ว่างเปล่า',
  filterOperatorIsAnyOf: 'เป็นหนึ่งใน',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'ประกอบด้วย',
  headerFilterOperatorDoesNotContain: 'ไม่ประกอบด้วย',
  headerFilterOperatorEquals: 'เท่ากับ',
  headerFilterOperatorDoesNotEqual: 'ไม่เท่ากับ',
  headerFilterOperatorStartsWith: 'เริ่มต้นด้วย',
  headerFilterOperatorEndsWith: 'ลงท้ายด้วย',
  headerFilterOperatorIs: 'คือ',
  headerFilterOperatorNot: 'ไม่ใช่',
  headerFilterOperatorAfter: 'หลังจาก',
  headerFilterOperatorOnOrAfter: 'ตั้งแต่หรือหลังจาก',
  headerFilterOperatorBefore: 'ก่อน',
  headerFilterOperatorOnOrBefore: 'ตั้งแต่หรือก่อน',
  headerFilterOperatorIsEmpty: 'ว่างเปล่า',
  headerFilterOperatorIsNotEmpty: 'ไม่ว่างเปล่า',
  headerFilterOperatorIsAnyOf: 'เป็นหนึ่งใน',
  'headerFilterOperator=': 'เท่ากับ',
  'headerFilterOperator!=': 'ไม่เท่ากับ',
  'headerFilterOperator>': 'มากกว่า',
  'headerFilterOperator>=': 'มากกว่าหรือเท่ากับ',
  'headerFilterOperator<': 'น้อยกว่า',
  'headerFilterOperator<=': 'น้อยกว่าหรือเท่ากับ',
  headerFilterClear: 'ล้างตัวกรอง',

  // Filter values text
  filterValueAny: 'ใดๆ',
  filterValueTrue: 'จริง',
  filterValueFalse: 'เท็จ',

  // Column menu text
  columnMenuLabel: 'เมนู',
  columnMenuAriaLabel: (columnName: string) => `เมนูคอลัมน์ ${columnName}`,
  columnMenuShowColumns: 'แสดงคอลัมน์',
  columnMenuManageColumns: 'จัดการคอลัมน์',
  columnMenuFilter: 'กรอง',
  columnMenuHideColumn: 'ซ่อนคอลัมน์',
  columnMenuUnsort: 'ยกเลิกการเรียงลำดับ',
  columnMenuSortAsc: 'เรียงจากน้อยไปมาก',
  columnMenuSortDesc: 'เรียงจากมากไปน้อย',
  columnMenuManagePivot: 'จัดการ Pivot',
  columnMenuManageCharts: 'จัดการแผนภูมิ',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `ตัวกรองที่ใช้งาน ${count} รายการ`,
  columnHeaderFiltersLabel: 'แสดงตัวกรอง',
  columnHeaderSortIconLabel: 'เรียงลำดับ',

  // Rows selected footer text
  footerRowSelected: (count) => `เลือกแล้ว ${count.toLocaleString()} แถว`,

  // Total row amount footer text
  footerTotalRows: 'จำนวนแถวทั้งหมด:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} จาก ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'เลือกด้วยช่องทำเครื่องหมาย',
  checkboxSelectionSelectAllRows: 'เลือกทุกแถว',
  checkboxSelectionUnselectAllRows: 'ยกเลิกเลือกทุกแถว',
  checkboxSelectionSelectRow: 'เลือกแถว',
  checkboxSelectionUnselectRow: 'ยกเลิกเลือกแถว',

  // Boolean cell text
  booleanCellTrueLabel: 'ใช่',
  booleanCellFalseLabel: 'ไม่ใช่',

  // Long text cell
  longTextCellExpandLabel: 'ขยาย',
  longTextCellCollapseLabel: 'ย่อ',

  // Actions cell more text
  actionsCellMore: 'เพิ่มเติม',

  // Column pinning text
  pinToLeft: 'ปักหมุดทางซ้าย',
  pinToRight: 'ปักหมุดทางขวา',
  unpin: 'เลิกปักหมุด',

  // Tree Data
  treeDataGroupingHeaderName: 'กลุ่ม',
  treeDataExpand: 'ดูรายการย่อย',
  treeDataCollapse: 'ซ่อนรายการย่อย',

  // Grouping columns
  groupingColumnHeaderName: 'กลุ่ม',
  groupColumn: (name) => `จัดกลุ่มตาม ${name}`,
  unGroupColumn: (name) => `ยกเลิกจัดกลุ่มตาม ${name}`,

  // Master/detail
  detailPanelToggle: 'สลับแผงรายละเอียด',
  expandDetailPanel: 'ขยาย',
  collapseDetailPanel: 'ย่อ',

  // Pagination
  paginationRowsPerPage: 'แถวต่อหน้า:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    const unknownRowCount = count == null || count === -1;
    if (!estimated) {
      return `${formatNumber(from)}–${formatNumber(to)} จาก ${!unknownRowCount ? formatNumber(count) : `มากกว่า ${formatNumber(to)}`}`;
    }
    const estimatedLabel =
      estimated > to ? `ประมาณ ${formatNumber(estimated)}` : `มากกว่า ${formatNumber(to)}`;
    return `${formatNumber(from)}–${formatNumber(to)} จาก ${!unknownRowCount ? formatNumber(count) : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'ไปหน้าแรก';
    }
    if (type === 'last') {
      return 'ไปหน้าสุดท้าย';
    }
    if (type === 'next') {
      return 'ไปหน้าถัดไป';
    }
    // if (type === 'previous') {
    return 'ไปหน้าก่อนหน้า';
  },

  // Row reordering text
  rowReorderingHeaderName: 'จัดเรียงแถวใหม่',

  // Aggregation
  aggregationMenuItemHeader: 'การรวมค่า',
  aggregationFunctionLabelNone: 'ไม่มี',
  aggregationFunctionLabelSum: 'ผลรวม',
  aggregationFunctionLabelAvg: 'ค่าเฉลี่ย',
  aggregationFunctionLabelMin: 'ค่าต่ำสุด',
  aggregationFunctionLabelMax: 'ค่าสูงสุด',
  aggregationFunctionLabelSize: 'จำนวน',

  // Pivot panel
  pivotToggleLabel: 'Pivot',
  pivotRows: 'แถว',
  pivotColumns: 'คอลัมน์',
  pivotValues: 'ค่า',
  pivotCloseButton: 'ปิดการตั้งค่า Pivot',
  pivotSearchButton: 'ค้นหาฟิลด์',
  pivotSearchControlPlaceholder: 'ค้นหาฟิลด์',
  pivotSearchControlLabel: 'ค้นหาฟิลด์',
  pivotSearchControlClear: 'ล้างการค้นหา',
  pivotNoFields: 'ไม่มีฟิลด์',
  pivotMenuMoveUp: 'ย้ายขึ้น',
  pivotMenuMoveDown: 'ย้ายลง',
  pivotMenuMoveToTop: 'ย้ายไปบนสุด',
  pivotMenuMoveToBottom: 'ย้ายไปล่างสุด',
  pivotMenuRows: 'แถว',
  pivotMenuColumns: 'คอลัมน์',
  pivotMenuValues: 'ค่า',
  pivotMenuOptions: 'ตัวเลือกฟิลด์',
  pivotMenuAddToRows: 'เพิ่มไปยังแถว',
  pivotMenuAddToColumns: 'เพิ่มไปยังคอลัมน์',
  pivotMenuAddToValues: 'เพิ่มไปยังค่า',
  pivotMenuRemove: 'ลบ',
  pivotDragToRows: 'ลากมาที่นี่เพื่อสร้างแถว',
  pivotDragToColumns: 'ลากมาที่นี่เพื่อสร้างคอลัมน์',
  pivotDragToValues: 'ลากมาที่นี่เพื่อสร้างค่า',
  pivotYearColumnHeaderName: '(ปี)',
  pivotQuarterColumnHeaderName: '(ไตรมาส)',

  // Charts configuration panel
  chartsNoCharts: 'ไม่มีแผนภูมิที่ใช้งานได้',
  chartsChartNotSelected: 'เลือกประเภทแผนภูมิเพื่อกำหนดค่าตัวเลือก',
  chartsTabChart: 'แผนภูมิ',
  chartsTabFields: 'ฟิลด์',
  chartsTabCustomize: 'ปรับแต่ง',
  chartsCloseButton: 'ปิดการตั้งค่าแผนภูมิ',
  chartsSyncButtonLabel: 'ซิงค์แผนภูมิ',
  chartsSearchPlaceholder: 'ค้นหาฟิลด์',
  chartsSearchLabel: 'ค้นหาฟิลด์',
  chartsSearchClear: 'ล้างการค้นหา',
  chartsNoFields: 'ไม่มีฟิลด์',
  chartsFieldBlocked: 'ไม่สามารถเพิ่มฟิลด์นี้ไปยังส่วนใดได้',
  chartsCategories: 'หมวดหมู่',
  chartsSeries: 'ชุดข้อมูล',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `เพิ่มไปยัง${dimensionLabel}`,
  chartsMenuAddToValues: (valuesLabel: string) => `เพิ่มไปยัง${valuesLabel}`,
  chartsMenuMoveUp: 'ย้ายขึ้น',
  chartsMenuMoveDown: 'ย้ายลง',
  chartsMenuMoveToTop: 'ย้ายไปบนสุด',
  chartsMenuMoveToBottom: 'ย้ายไปล่างสุด',
  chartsMenuOptions: 'ตัวเลือกฟิลด์',
  chartsMenuRemove: 'ลบ',
  chartsDragToDimensions: (dimensionLabel: string) =>
    `ลากมาที่นี่เพื่อใช้คอลัมน์เป็น${dimensionLabel}`,
  chartsDragToValues: (valuesLabel: string) => `ลากมาที่นี่เพื่อใช้คอลัมน์เป็น${valuesLabel}`,

  // AI Assistant panel
  aiAssistantPanelTitle: 'ผู้ช่วย AI',
  aiAssistantPanelClose: 'ปิดผู้ช่วย AI',
  aiAssistantPanelNewConversation: 'บทสนทนาใหม่',
  aiAssistantPanelConversationHistory: 'ประวัติบทสนทนา',
  aiAssistantPanelEmptyConversation: 'ไม่มีประวัติคำสั่ง',
  aiAssistantSuggestions: 'คำแนะนำ',

  // Prompt field
  promptFieldLabel: 'คำสั่ง',
  promptFieldPlaceholder: 'พิมพ์คำสั่ง…',
  promptFieldPlaceholderWithRecording: 'พิมพ์หรือบันทึกเสียงคำสั่ง…',
  promptFieldPlaceholderListening: 'กำลังฟังคำสั่ง…',
  promptFieldSpeechRecognitionNotSupported: 'เบราว์เซอร์นี้ไม่รองรับการรู้จำเสียง',
  promptFieldSend: 'ส่ง',
  promptFieldRecord: 'บันทึกเสียง',
  promptFieldStopRecording: 'หยุดบันทึกเสียง',

  // Prompt
  promptRerun: 'รันอีกครั้ง',
  promptProcessing: 'กำลังประมวลผล…',
  promptAppliedChanges: 'นำการเปลี่ยนแปลงไปใช้แล้ว',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `จัดกลุ่มตาม ${column}`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `รวมค่า ${column} (${aggregation})`,
  promptChangeFilterLabel: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `${column} เป็นหนึ่งใน: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (column: string, operator: string, value: string) => {
    if (operator === 'is any of') {
      return `กรองโดยที่ ${column} เป็นหนึ่งใน: ${value}`;
    }
    return `กรองโดยที่ ${column} ${operator} ${value}`;
  },
  promptChangeSortDescription: (column: string, direction: string) =>
    `เรียงตาม ${column} (${direction})`,
  promptChangePivotEnableLabel: 'Pivot',
  promptChangePivotEnableDescription: 'เปิดใช้งาน Pivot',
  promptChangePivotColumnsLabel: (count: number) => `คอลัมน์ (${count})`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `แถว (${count})`,
  promptChangePivotValuesLabel: (count: number) => `ค่า (${count})`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `มิติ (${dimensionsCount}), ค่า (${valuesCount})`,
};

export const thTH: Localization = getGridLocalization(thTHGrid);
