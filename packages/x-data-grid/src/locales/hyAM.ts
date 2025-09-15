import { hyAM as hyAMCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const hyAMGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Տվյալներ չկան',
  noResultsOverlayLabel: 'Արդյունքներ չեն գտնվել։',

  // Density selector toolbar button text
  toolbarDensity: 'Խտություն',
  toolbarDensityLabel: 'Խտություն',
  toolbarDensityCompact: 'Կոմպակտ',
  toolbarDensityStandard: 'Ստանդարտ',
  toolbarDensityComfortable: 'Հարմարավետ',

  // Columns selector toolbar button text
  toolbarColumns: 'Սյունակներ',
  toolbarColumnsLabel: 'Ընտրել սյունակներ',

  // Filters toolbar button text
  toolbarFilters: 'Զտիչներ',
  toolbarFiltersLabel: 'Ցուցադրել զտիչները',
  toolbarFiltersTooltipHide: 'Թաքցնել զտիչները',
  toolbarFiltersTooltipShow: 'Ցուցադրել զտիչները',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'ակտիվ զտիչ';
    if (count === 1) {
      pluralForm = 'ակտիվ զտիչ';
    } else {
      pluralForm = 'ակտիվ զտիչներ';
    }
    return `${count} ${pluralForm}`;
  },

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Որոնել…',
  toolbarQuickFilterLabel: 'Որոնել',
  toolbarQuickFilterDeleteIconLabel: 'Մաքրել',

  // Export selector toolbar button text
  toolbarExport: 'Արտահանում',
  toolbarExportLabel: 'Արտահանում',
  toolbarExportCSV: 'Ներբեռնել CSV-ով',
  toolbarExportPrint: 'Տպել',
  toolbarExportExcel: 'Ներբեռնել Excel-ով',

  // Columns management text
  columnsManagementSearchTitle: 'Որոնել',
  columnsManagementNoColumns: 'Սյունակներ չկան',
  columnsManagementShowHideAllText: 'Ցուցադրել/Թաքցնել բոլորը',
  columnsManagementReset: 'Վերակայել',
  columnsManagementDeleteIconLabel: 'Հեռացնել',

  // Filter panel text
  filterPanelAddFilter: 'Ավելացնել զտիչ',
  filterPanelRemoveAll: 'Հեռացնել բոլորը',
  filterPanelDeleteIconLabel: 'Հեռացնել',
  filterPanelLogicOperator: 'Տրամաբանական օպերատոր',
  filterPanelOperator: 'Օպերատոր',
  filterPanelOperatorAnd: 'Եվ',
  filterPanelOperatorOr: 'Կամ',
  filterPanelColumns: 'Սյունակներ',
  filterPanelInputLabel: 'Արժեք',
  filterPanelInputPlaceholder: 'Զտիչի արժեք',

  // Filter operators text
  filterOperatorContains: 'պարունակում է',
  filterOperatorDoesNotContain: 'չի պարունակում',
  filterOperatorEquals: 'հավասար է',
  filterOperatorDoesNotEqual: 'հավասար չէ',
  filterOperatorStartsWith: 'սկսվում է',
  filterOperatorEndsWith: 'վերջանում է',
  filterOperatorIs: 'է',
  filterOperatorNot: 'չէ',
  filterOperatorAfter: 'հետո է',
  filterOperatorOnOrAfter: 'այդ օրը կամ հետո է',
  filterOperatorBefore: 'մինչ է',
  filterOperatorOnOrBefore: 'այդ օրը կամ առաջ է',
  filterOperatorIsEmpty: 'դատարկ է',
  filterOperatorIsNotEmpty: 'դատարկ չէ',
  filterOperatorIsAnyOf: 'որևէ մեկը',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Պարունակում է',
  headerFilterOperatorDoesNotContain: 'Չի պարունակում',
  headerFilterOperatorEquals: 'Հավասար է',
  headerFilterOperatorDoesNotEqual: 'Հավասար չէ',
  headerFilterOperatorStartsWith: 'Սկսվում է',
  headerFilterOperatorEndsWith: 'Վերջանում է',
  headerFilterOperatorIs: 'Է',
  headerFilterOperatorNot: 'Չէ',
  headerFilterOperatorAfter: 'Հետո է',
  headerFilterOperatorOnOrAfter: 'Այդ օրը կամ հետո է',
  headerFilterOperatorBefore: 'Մինչ է',
  headerFilterOperatorOnOrBefore: 'Այդ օրը կամ առաջ է',
  headerFilterOperatorIsEmpty: 'Դատարկ է',
  headerFilterOperatorIsNotEmpty: 'Դատարկ չէ',
  headerFilterOperatorIsAnyOf: 'Որևէ մեկը',
  'headerFilterOperator=': 'Հավասար է',
  'headerFilterOperator!=': 'Հավասար չէ',
  'headerFilterOperator>': 'Ավելի մեծ է',
  'headerFilterOperator>=': 'Ավելի մեծ կամ հավասար է',
  'headerFilterOperator<': 'Ավելի փոքր է',
  'headerFilterOperator<=': 'Ավելի փոքր կամ հավասար է',

  // Filter values text
  filterValueAny: 'ցանկացած',
  filterValueTrue: 'այո',
  filterValueFalse: 'ոչ',

  // Column menu text
  columnMenuLabel: 'Մենյու',
  columnMenuAriaLabel: (columnName: string) => `${columnName} սյունակի մենյու`,
  columnMenuShowColumns: 'Ցուցադրել սյունակները',
  columnMenuManageColumns: 'Կառավարել սյունակները',
  columnMenuFilter: 'Զտիչ',
  columnMenuHideColumn: 'Թաքցնել',
  columnMenuUnsort: 'Մաքրել դասավորումը',
  columnMenuSortAsc: 'Աճման կարգով դասավորել',
  columnMenuSortDesc: 'Նվազման կարգով դասավորել',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'ակտիվ զտիչներ';
    if (count === 1) {
      pluralForm = 'ակտիվ զտիչ';
    }
    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Ցուցադրել զտիչները',
  columnHeaderSortIconLabel: 'Դասավորել',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'ընտրված տող';
    if (count === 1) {
      pluralForm = 'ընտրված տող';
    } else {
      pluralForm = 'ընտրված տողեր';
    }
    return `${count} ${pluralForm}`;
  },

  // Total row amount footer text
  footerTotalRows: 'Ընդամենը տողեր:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => {
    return `${visibleCount.toLocaleString()} / ${totalCount.toLocaleString()}`;
  },

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Տողի ընտրություն',
  checkboxSelectionSelectAllRows: 'Ընտրել բոլոր տողերը',
  checkboxSelectionUnselectAllRows: 'Չընտրել բոլոր տողերը',
  checkboxSelectionSelectRow: 'Ընտրել տողը',
  checkboxSelectionUnselectRow: 'Չընտրել տողը',

  // Boolean cell text
  booleanCellTrueLabel: 'այո',
  booleanCellFalseLabel: 'ոչ',

  // Actions cell more text
  actionsCellMore: 'ավելին',

  // Column pinning text
  pinToLeft: 'Կցել ձախ',
  pinToRight: 'Կցել աջ',
  unpin: 'Անջատել',

  // Tree Data
  treeDataGroupingHeaderName: 'Խումբ',
  treeDataExpand: 'Բացել ենթատողերը',
  treeDataCollapse: 'Փակել ենթատողերը',

  // Grouping columns
  groupingColumnHeaderName: 'Խմբավորում',
  groupColumn: (name) => `Խմբավորել ըստ ${name}`,
  unGroupColumn: (name) => `Չխմբավորել ըստ ${name}`,

  // Master/detail
  detailPanelToggle: 'Փոխարկել մանրամասն տեսքը',
  expandDetailPanel: 'Բացել',
  collapseDetailPanel: 'Փակել',

  // Row reordering text
  rowReorderingHeaderName: 'Տողերի վերադասավորում',

  // Aggregation
  aggregationMenuItemHeader: 'Ագրեգացում',
  aggregationFunctionLabelSum: 'գումար',
  aggregationFunctionLabelAvg: 'միջին',
  aggregationFunctionLabelMin: 'մինիմում',
  aggregationFunctionLabelMax: 'մաքսիմում',
  aggregationFunctionLabelSize: 'քանակ',
};

export const hyAM: Localization = getGridLocalization(hyAMGrid, hyAMCore);
