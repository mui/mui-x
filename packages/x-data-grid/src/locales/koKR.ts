import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const koKRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: '행이 없습니다.',
  noResultsOverlayLabel: '결과값이 없습니다.',
  noColumnsOverlayLabel: '열이 없습니다',
  noColumnsOverlayManageColumns: '열 관리하기',
  emptyPivotOverlayLabel: '행, 열, 값을 추가하여 피벗 테이블을 만듭니다.',

  // Density selector toolbar button text
  toolbarDensity: '행 간격',
  toolbarDensityLabel: '행 간격',
  toolbarDensityCompact: '좁게',
  toolbarDensityStandard: '기본',
  toolbarDensityComfortable: '넓게',

  // Columns selector toolbar button text
  toolbarColumns: '열 목록',
  toolbarColumnsLabel: '열 선택',

  // Filters toolbar button text
  toolbarFilters: '필터',
  toolbarFiltersLabel: '필터 표시',
  toolbarFiltersTooltipHide: '필터 숨기기',
  toolbarFiltersTooltipShow: '필터 표시',
  toolbarFiltersTooltipActive: (count) => `${count}건의 필터를 적용중`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: '검색…',
  toolbarQuickFilterLabel: '검색',
  toolbarQuickFilterDeleteIconLabel: '초기화',

  // Export selector toolbar button text
  toolbarExport: '내보내기',
  toolbarExportLabel: '내보내기',
  toolbarExportCSV: 'CSV로 내보내기',
  toolbarExportPrint: '프린트',
  toolbarExportExcel: 'Excel로 내보내기',

  // Toolbar pivot button
  toolbarPivot: '피벗',

  // Toolbar AI Assistant button
  toolbarAssistant: 'AI 어시스턴트',

  // Columns management text
  columnsManagementSearchTitle: '검색',
  columnsManagementNoColumns: '열이 없습니다.',
  columnsManagementShowHideAllText: '모두 보기/숨기기',
  columnsManagementReset: '초기화',
  columnsManagementDeleteIconLabel: '제거',

  // Filter panel text
  filterPanelAddFilter: '필터 추가',
  filterPanelRemoveAll: '모두 삭제',
  filterPanelDeleteIconLabel: '삭제',
  filterPanelLogicOperator: '논리 연산자',
  filterPanelOperator: '연산자',
  filterPanelOperatorAnd: '그리고',
  filterPanelOperatorOr: '또는',
  filterPanelColumns: '목록',
  filterPanelInputLabel: '값',
  filterPanelInputPlaceholder: '값 입력',

  // Filter operators text
  filterOperatorContains: '포함하는',
  filterOperatorDoesNotContain: '포함하지 않는',
  filterOperatorEquals: '값이 같은',
  filterOperatorDoesNotEqual: '값이 다른',
  filterOperatorStartsWith: '시작하는',
  filterOperatorEndsWith: '끝나는',
  filterOperatorIs: '~인',
  filterOperatorNot: '~아닌',
  filterOperatorAfter: '더 이후',
  filterOperatorOnOrAfter: '이후',
  filterOperatorBefore: '더 이전',
  filterOperatorOnOrBefore: '이전',
  filterOperatorIsEmpty: '값이 없는',
  filterOperatorIsNotEmpty: '값이 있는',
  filterOperatorIsAnyOf: '값 중 하나인',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: '포함하는',
  headerFilterOperatorDoesNotContain: '포함하지 않는',
  headerFilterOperatorEquals: '값이 같은',
  headerFilterOperatorDoesNotEqual: '값이 다른',
  headerFilterOperatorStartsWith: '시작하는',
  headerFilterOperatorEndsWith: '끝나는',
  headerFilterOperatorIs: '~인',
  headerFilterOperatorNot: '~아닌',
  headerFilterOperatorAfter: '더 이후',
  headerFilterOperatorOnOrAfter: '이후',
  headerFilterOperatorBefore: '더 이전',
  headerFilterOperatorOnOrBefore: '이전',
  headerFilterOperatorIsEmpty: '값이 없는',
  headerFilterOperatorIsNotEmpty: '값이 있는',
  headerFilterOperatorIsAnyOf: '값 중 하나인',
  'headerFilterOperator=': '값이 같은',
  'headerFilterOperator!=': '값이 다른',
  'headerFilterOperator>': '더 큰',
  'headerFilterOperator>=': '같거나 더 큰',
  'headerFilterOperator<': '더 작은',
  'headerFilterOperator<=': '같거나 더 작은',
  headerFilterClear: '필터 초기화',

  // Filter values text
  filterValueAny: '아무값',
  filterValueTrue: '참',
  filterValueFalse: '거짓',

  // Column menu text
  columnMenuLabel: '메뉴',
  columnMenuAriaLabel: (columnName: string) => `${columnName} 열 메뉴`,
  columnMenuShowColumns: '열 표시',
  columnMenuManageColumns: '열 관리',
  columnMenuFilter: '필터',
  columnMenuHideColumn: '열 숨기기',
  columnMenuUnsort: '정렬 해제',
  columnMenuSortAsc: '오름차순 정렬',
  columnMenuSortDesc: '내림차순 정렬',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count}건의 필터를 적용중`,
  columnHeaderFiltersLabel: '필터 표시',
  columnHeaderSortIconLabel: '정렬',

  // Rows selected footer text
  footerRowSelected: (count) => `${count}행 선택중`,

  // Total row amount footer text
  footerTotalRows: '총 행수:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: '선택',
  checkboxSelectionSelectAllRows: '모든 행 선택',
  checkboxSelectionUnselectAllRows: '모든 행 선택 해제',
  checkboxSelectionSelectRow: '행 선택',
  checkboxSelectionUnselectRow: '행 선택 해제',

  // Boolean cell text
  booleanCellTrueLabel: '참',
  booleanCellFalseLabel: '거짓',

  // Actions cell more text
  actionsCellMore: '더보기',

  // Column pinning text
  pinToLeft: '왼쪽에 고정',
  pinToRight: '오른쪽에 고정',
  unpin: '고정 해제',

  // Tree Data
  treeDataGroupingHeaderName: '그룹',
  treeDataExpand: '하위노드 펼치기',
  treeDataCollapse: '하위노드 접기',

  // Grouping columns
  groupingColumnHeaderName: '그룹',
  groupColumn: (name) => `${name} 값으로 그룹 생성`,
  unGroupColumn: (name) => `${name} 값으로 그룹 해제`,

  // Master/detail
  detailPanelToggle: '상세 패널 토글',
  expandDetailPanel: '열기',
  collapseDetailPanel: '접기',

  // Pagination
  paginationRowsPerPage: '페이지 당 행:',
  paginationDisplayedRows: ({ from, to, count, estimated }) => {
    if (!estimated) {
      return `${from}–${to} of ${count !== -1 ? count : `${to} 이상`}`;
    }
    const estimatedLabel = estimated && estimated > to ? `약 ${estimated}` : `${to} 이상`;
    return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return '첫 번째 페이지로 이동';
    }
    if (type === 'last') {
      return '마지막 페이지로 이동';
    }
    if (type === 'next') {
      return '다음 페이지로 이동';
    }
    // if (type === 'previous') {
    return '이전 페이지로 이동';
  },

  // Row reordering text
  rowReorderingHeaderName: '행 재배치',

  // Aggregation
  aggregationMenuItemHeader: '집계',
  aggregationFunctionLabelSum: '합',
  aggregationFunctionLabelAvg: '평균',
  aggregationFunctionLabelMin: '최소값',
  aggregationFunctionLabelMax: '최대값',
  aggregationFunctionLabelSize: '크기',

  // Pivot panel
  pivotToggleLabel: '피벗',
  pivotRows: '행',
  pivotColumns: '열',
  pivotValues: '값',
  pivotCloseButton: '피벗 설정 닫기',
  pivotSearchButton: '필드 검색',
  pivotSearchControlPlaceholder: '필드 검색',
  pivotSearchControlLabel: '필드 검색',
  pivotSearchControlClear: '검색 초기화',
  pivotNoFields: '필드가 없습니다.',
  pivotMenuMoveUp: '위로 이동',
  pivotMenuMoveDown: '아래로 이동',
  pivotMenuMoveToTop: '위로 이동',
  pivotMenuMoveToBottom: '아래로 이동',
  pivotMenuRows: '행',
  pivotMenuColumns: '열',
  pivotMenuValues: '값',
  pivotMenuOptions: '필드 옵션',
  pivotMenuAddToRows: '행에 추가',
  pivotMenuAddToColumns: '열에 추가',
  pivotMenuAddToValues: '값에 추가',
  pivotMenuRemove: '제거',
  pivotDragToRows: '행 생성',
  pivotDragToColumns: '열 생성',
  pivotDragToValues: '값 생성',
  pivotYearColumnHeaderName: '(년)',
  pivotQuarterColumnHeaderName: '(분기)',

  // AI Assistant panel
  aiAssistantPanelTitle: 'AI 어시스턴트',
  aiAssistantPanelClose: 'AI 어시스턴트 닫기',
  aiAssistantPanelNewConversation: '새 대화',
  aiAssistantPanelConversationHistory: '대화 기록',
  aiAssistantPanelEmptyConversation: '프롬프트 내역이 없습니다.',
  aiAssistantSuggestions: '제안',

  // Prompt field
  promptFieldLabel: '프롬프트 입력',
  promptFieldPlaceholder: '프롬프트 입력…',
  promptFieldPlaceholderWithRecording: '프롬프트 입력 또는 녹음…',
  promptFieldPlaceholderListening: '녹음 중…',
  promptFieldSpeechRecognitionNotSupported: '이 브라우저에서 음성 인식을 지원하지 않습니다.',
  promptFieldSend: '전송',
  promptFieldRecord: '녹음',
  promptFieldStopRecording: '녹음 정지',

  // Prompt
  promptRerun: '다시 실행',
  promptProcessing: '처리 중…',
  promptAppliedChanges: '변경사항 적용하기',

  // Prompt changes
  promptChangeGroupDescription: (column: string) => `${column} 값으로 그룹 생성`,
  promptChangeAggregationLabel: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
  promptChangeAggregationDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation}) 집계`,
  // promptChangeFilterLabel: (column: string, operator: string, value: string) => {
  //   if (operator === 'is any of') {
  //     return `${column} is any of: ${value}`;
  //   }
  //   return `${column} ${operator} ${value}`;
  // },
  // promptChangeFilterDescription: (column: string, operator: string, value: string) => {
  //   if (operator === 'is any of') {
  //     return `Filter where ${column} is any of: ${value}`;
  //   }
  //   return `Filter where ${column} ${operator} ${value}`;
  // },
  promptChangeSortDescription: (column: string, direction: string) =>
    `${column} (${direction}) 기준으로 정렬`,
  promptChangePivotEnableLabel: '피벗',
  promptChangePivotEnableDescription: '피벗 활성화',
  promptChangePivotColumnsLabel: (count: number) => `(${count}) 개의 열`,
  promptChangePivotColumnsDescription: (column: string, direction: string) =>
    `${column}${direction ? ` (${direction})` : ''}`,
  promptChangePivotRowsLabel: (count: number) => `(${count}) 개의 행`,
  promptChangePivotValuesLabel: (count: number) => `(${count}) 개의 값`,
  promptChangePivotValuesDescription: (column: string, aggregation: string) =>
    `${column} (${aggregation})`,
};

export const koKR: Localization = getGridLocalization(koKRGrid);
