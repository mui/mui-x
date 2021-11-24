import { koKR as koKRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const koKRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: '행이 없습니다.',
  noResultsOverlayLabel: '결과값이 없습니다.',
  errorOverlayDefaultLabel: '오류가 발생했습니다.',

  // Density selector toolbar button text
  toolbarDensity: '라인 간격',
  toolbarDensityLabel: '라인 간격',
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

  // Export selector toolbar button text
  toolbarExport: '내보내기',
  toolbarExportLabel: '내보내기',
  toolbarExportCSV: 'CSV다운로드',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: '열 검색',
  columnsPanelTextFieldPlaceholder: '열 이름',
  columnsPanelDragIconLabel: '열 정렬',
  columnsPanelShowAllButton: '모두 보기',
  columnsPanelHideAllButton: '모두 숨기기',

  // Filter panel text
  filterPanelAddFilter: '필터 추가',
  filterPanelDeleteIconLabel: '삭제',
  filterPanelOperators: '연산자',
  filterPanelOperatorAnd: '그리고',
  filterPanelOperatorOr: '또는',
  filterPanelColumns: '목록',
  filterPanelInputLabel: '값',
  filterPanelInputPlaceholder: '값 입력',

  // Filter operators text
  filterOperatorContains: '포함하는',
  filterOperatorEquals: '값이 같은',
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

  // Filter values text
  filterValueAny: '아무값',
  filterValueTrue: '참',
  filterValueFalse: '거짓',

  // Column menu text
  columnMenuLabel: '메뉴',
  columnMenuShowColumns: '열 표시',
  columnMenuFilter: '필터',
  columnMenuHideColumn: '열 숨기기',
  columnMenuUnsort: '정렬 해제',
  columnMenuSortAsc: '오름차순 정렬',
  columnMenuSortDesc: '내림차순 정렬',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `${count}건의 필터를 적용중`,
  columnHeaderFiltersLabel: '필터 표시',
  columnHeaderSortIconLabel: '정렬',

  // Rows selected footer text
  footerRowSelected: (count) => `${count}행 선택중`,

  // Total rows footer text
  footerTotalRows: '총 행수:',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  // checkboxSelectionHeaderName: 'Checkbox selection',

  // Boolean cell text
  booleanCellTrueLabel: '참',
  booleanCellFalseLabel: '거짓',

  // Actions cell more text
  // actionsCellMore: 'more',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',
};

export const koKR: Localization = getGridLocalization(koKRGrid, koKRCore);
