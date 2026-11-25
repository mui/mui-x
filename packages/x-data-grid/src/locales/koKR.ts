import type { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, buildLocaleFormat } from '../utils/getGridLocalization';
import type { Localization } from '../utils/getGridLocalization';

const formatNumber = buildLocaleFormat('ko-KR');

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

  // Undo/redo toolbar button text
  toolbarUndo: '실행 취소',
  toolbarRedo: '다시 실행',

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

  // Toolbar charts button
  toolbarCharts: '차트',

  // Toolbar AI Assistant button
  toolbarAssistant: 'AI 어시스턴트',

  // Formula bar (Premium formulas)
  formulaBarLabel: '수식 입력줄',
  formulaBarInputLabel: '수식',
  formulaBarAddressLabel: '활성 셀',

  // Computed columns (Premium)
  columnMenuAddComputedColumn: '계산 열 추가',
  columnMenuEditComputedColumn: '계산 열 편집',
  columnMenuViewComputedColumn: '계산 열 보기',
  columnMenuRemoveComputedColumn: '계산 열 제거',
  toolbarComputedColumns: '계산 열',
  computedColumnsPanelTitle: '계산 열',
  computedColumnsPanelCloseButton: '계산 열 패널 닫기',
  computedColumnsPanelBackButton: '목록으로 돌아가기',
  computedColumnsPanelEmpty: '아직 계산 열이 없습니다.',
  computedColumnsPanelAddButton: '계산 열 추가',
  computedColumnsPanelItemMenuLabel: '계산 열 작업',
  computedColumnsPanelItemReadOnlyLabel: '읽기 전용',
  computedColumnEditorNewTitle: '새 계산 열',
  computedColumnEditorEditTitle: '계산 열 편집',
  computedColumnEditorViewTitle: '계산 열 보기',
  computedColumnReadOnlyHint: '이 계산 열은 편집할 수 없습니다.',
  computedColumnNameLabel: '이름',
  computedColumnFieldLabel: '필드',
  computedColumnFormulaLabel: '수식',
  computedColumnTypeLabel: '결과 유형',
  computedColumnTypeNumber: '숫자',
  computedColumnTypeString: '텍스트',
  computedColumnTypeBoolean: '참/거짓',
  computedColumnTypeDate: '날짜',
  computedColumnTypeDateTime: '날짜 및 시간',
  computedColumnFormatLabel: '형식',
  computedColumnFormatStyleDecimal: '숫자',
  computedColumnFormatStylePercent: '백분율',
  computedColumnFormatStyleCurrency: '통화',
  computedColumnFormatCurrencyLabel: '통화 코드',
  computedColumnFormatDecimalsLabel: '소수 자릿수',
  computedColumnFormatGroupingLabel: '천 단위 구분 기호',
  computedColumnPreviewLabel: '미리보기',
  computedColumnPreviewRow: (rowIndex) => `${rowIndex}행`,
  computedColumnPreviewNoRows: '미리 볼 행이 없습니다.',
  computedColumnReferenceTitle: '삽입',
  computedColumnReferenceColumns: '열',
  computedColumnReferenceFunctions: '함수',
  computedColumnReferenceSearchPlaceholder: '검색',
  computedColumnReferenceNoResults: '일치하는 항목이 없습니다.',
  computedColumnApplyButton: '적용',
  computedColumnAddButton: '열 추가',
  computedColumnCancelButton: '취소',
  computedColumnCloseButton: '닫기',
  computedColumnDeleteButton: '열 삭제',
  computedColumnHeaderLabel: '계산 열',
  computedColumnHeaderInvalidLabel: '수식이 잘못된 계산 열',
  computedColumnErrorNameRequired: '이름을 입력하세요.',
  computedColumnErrorFieldRequired: '필드 이름을 입력하세요.',
  computedColumnErrorFieldInvalid: '문자, 숫자, 밑줄만 사용하고 문자나 밑줄로 시작하세요.',
  computedColumnErrorFieldExists: (field) => `필드가 "${field}"인 열이 이미 있습니다.`,
  computedColumnErrorFieldA1Like: '이 필드 이름은 셀 주소로 읽힙니다. 더 긴 이름을 선택하세요.',
  computedColumnErrorFormulaRequired: '수식을 입력하세요.',
  computedColumnErrorParse: (message) => `수식 오류: ${message}`,
  computedColumnErrorUnknownFunction: (name) => `알 수 없는 함수 ${name}입니다.`,
  computedColumnErrorUnsupportedReference:
    '계산 열은 같은 행의 열만 참조할 수 있습니다. 필드 이름만 사용하세요.',
  computedColumnErrorUnknownField: (field) => `"${field}" 열이 없습니다.`,
  computedColumnErrorSelfReference: '계산 열은 자기 자신을 참조할 수 없습니다.',
  computedColumnErrorCycle: (path) => `순환 참조: ${path}.`,
  computedCellErrorDivByZero:
    '이 행에서 0으로 나누었습니다. 대체 값을 지정하려면 나눗셈을 IFERROR(…, 0)으로 감싸세요.',
  computedCellErrorValue: '이 행의 값 중 이 연산에 맞지 않는 유형이 있습니다.',
  computedCellErrorRef: '참조한 열이 없습니다.',
  computedCellErrorName: '수식에 알 수 없는 함수가 있습니다.',
  computedCellErrorCycle: '수식이 자기 자신에 의존합니다.',
  computedCellErrorGeneric: '이 행에서는 수식을 계산할 수 없습니다.',

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
  filterPanelColumn: '목록',
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
  columnMenuManagePivot: '피벗 관리',
  columnMenuManageCharts: '차트 관리',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count}건의 필터를 적용중`,
  columnHeaderFiltersLabel: '필터 표시',
  columnHeaderSortIconLabel: '정렬',
  columnHeaderSortIconAriaLabel: (columnName, direction) => {
    if (direction === 'asc') {
      return `${columnName} 오름차순 정렬`;
    }
    if (direction === 'desc') {
      return `${columnName} 내림차순 정렬`;
    }
    return `${columnName} 정렬 해제`;
  },

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

  // Cell editor text
  emptyCellLabel: '비어 있음',

  // Long text cell
  longTextCellExpandLabel: '열기',
  longTextCellCollapseLabel: '접기',

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
      return `${formatNumber(from)}–${formatNumber(to)} / ${count !== -1 ? formatNumber(count) : `${formatNumber(to)} 이상`}`;
    }
    const estimatedLabel =
      estimated && estimated > to ? `약 ${formatNumber(estimated)}` : `${formatNumber(to)} 이상`;
    return `${formatNumber(from)}–${formatNumber(to)} / ${count !== -1 ? formatNumber(count) : estimatedLabel}`;
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
  // rowReorderingAnnouncementMoved: ({
  //   position,
  //   total
  // }) => `Row moved to position ${formatNumber(position)} of ${formatNumber(total)}.`,
  // rowReorderingAnnouncementEdge: ({
  //   direction
  // }) => `Can't move the row further ${direction === 'up' ? 'up' : 'down'}.`,
  // rowReorderingAnnouncementSorted: () => "Rows can't be reordered while the grid is sorted.",
  // rowReorderingAnnouncementInvalid: () => "The row can't be moved there.",
  // rowReorderingAnnouncementDisabled: () => "This row can't be reordered.",
  // rowReorderingKeyboardDescription: () => 'Press Alt+Up Arrow or Alt+Down Arrow to move the row.',

  // Column reordering text
  // columnReorderingAnnouncementMoved: ({
  //   columnName,
  //   position,
  //   total
  // }) => `Column ${columnName} moved to position ${formatNumber(position)} of ${formatNumber(total)}.`,
  // columnReorderingAnnouncementEdge: ({
  //   columnName,
  //   direction
  // }) => `Can't move column ${columnName} further ${direction === 'left' ? 'left' : 'right'}.`,
  // columnReorderingAnnouncementDisabled: ({
  //   columnName
  // }) => `Column ${columnName} can't be reordered.`,
  // columnReorderingKeyboardDescription: () => 'Press Alt+Left Arrow or Alt+Right Arrow to move the column.',

  // Aggregation
  aggregationMenuItemHeader: '집계',
  aggregationFunctionLabelNone: '없음',
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
  pivotMenuMoveToTop: '맨 위로 이동',
  pivotMenuMoveToBottom: '맨 아래로 이동',
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

  // Charts configuration panel
  chartsNoCharts: '사용할 수 있는 차트가 없습니다.',
  chartsChartNotSelected: '옵션을 설정하려면 차트 유형을 선택하세요.',
  chartsTabChart: '차트',
  chartsTabFields: '필드',
  chartsTabCustomize: '맞춤 설정',
  chartsCloseButton: '차트 설정 닫기',
  chartsSyncButtonLabel: '차트 동기화',
  chartsSearchPlaceholder: '필드 검색',
  chartsSearchLabel: '필드 검색',
  chartsSearchClear: '검색 초기화',
  chartsNoFields: '필드가 없습니다.',
  chartsFieldBlocked: '이 필드는 어떤 섹션에도 추가할 수 없습니다.',
  chartsCategories: '카테고리',
  chartsSeries: '계열',
  chartsMenuAddToDimensions: (dimensionLabel: string) => `${dimensionLabel}에 추가`,
  chartsMenuAddToValues: (valuesLabel: string) => `${valuesLabel}에 추가`,
  chartsMenuMoveUp: '위로 이동',
  chartsMenuMoveDown: '아래로 이동',
  chartsMenuMoveToTop: '맨 위로 이동',
  chartsMenuMoveToBottom: '맨 아래로 이동',
  chartsMenuOptions: '필드 옵션',
  chartsMenuRemove: '제거',
  chartsDragToDimensions: (dimensionLabel: string) => `여기로 열을 끌어와 ${dimensionLabel}에 추가`,
  chartsDragToValues: (valuesLabel: string) => `여기로 열을 끌어와 ${valuesLabel}에 추가`,

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
  promptChangeFilterLabel: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `${column} ${operator}: ${value}`;
    }
    return `${column} ${operator} ${value}`;
  },
  promptChangeFilterDescription: (
    column: string,
    operator: string,
    value: string,
    operatorValue?: string,
  ) => {
    if (operatorValue === 'isAnyOf') {
      return `필터: ${column} ${operator}: ${value}`;
    }
    return `필터: ${column} ${operator} ${value}`;
  },
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
  promptChangeChartsLabel: (dimensionsCount: number, valuesCount: number) =>
    `차원 (${dimensionsCount}), 값 (${valuesCount})`,
};

export const koKR: Localization = getGridLocalization(koKRGrid);
