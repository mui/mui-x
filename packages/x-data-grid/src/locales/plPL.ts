import { plPL as plPLCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const plPLGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Brak danych',
  noResultsOverlayLabel: 'Nie znaleziono wyników.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',

  // Density selector toolbar button text
  toolbarDensity: 'Wysokość rzędu',
  toolbarDensityLabel: 'Wysokość rzędu',
  toolbarDensityCompact: 'Kompakt',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Komfort',

  // Columns selector toolbar button text
  toolbarColumns: 'Kolumny',
  toolbarColumnsLabel: 'Zaznacz kolumny',

  // Filters toolbar button text
  toolbarFilters: 'Filtry',
  toolbarFiltersLabel: 'Pokaż filtry',
  toolbarFiltersTooltipHide: 'Ukryj filtry',
  toolbarFiltersTooltipShow: 'Pokaż filtry',
  toolbarFiltersTooltipActive: (count) => `Liczba aktywnych filtrów: ${count}`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Wyszukaj…',
  toolbarQuickFilterLabel: 'Szukaj',
  toolbarQuickFilterDeleteIconLabel: 'Wyczyść',

  // Prompt toolbar field
  toolbarPromptControlPlaceholder: 'Wpisz polecenie...',
  toolbarPromptControlWithRecordingPlaceholder: 'Wpisz lub nagraj polecenie...',
  toolbarPromptControlRecordingPlaceholder: 'Nasłuchiwanie polecenia...',
  toolbarPromptControlLabel: 'Wprowadź polecenie',
  toolbarPromptControlRecordButtonDefaultLabel: 'Nagrywaj',
  toolbarPromptControlRecordButtonActiveLabel: 'Zatrzymaj nagrywanie',
  toolbarPromptControlSendActionLabel: 'Wyślij',
  toolbarPromptControlSendActionAriaLabel: 'Wyślij polecenie',
  toolbarPromptControlErrorMessage:
    'Wystąpił błąd podczas przetwarzania żądania. Spróbuj ponownie z innym poleceniem.',

  // Export selector toolbar button text
  toolbarExport: 'Eksportuj',
  toolbarExportLabel: 'Eksportuj',
  toolbarExportCSV: 'Pobierz jako plik CSV',
  toolbarExportPrint: 'Drukuj',
  toolbarExportExcel: 'Pobierz jako plik Excel',

  // Columns management text
  columnsManagementSearchTitle: 'Szukaj',
  columnsManagementNoColumns: 'Brak kolumn',
  columnsManagementShowHideAllText: 'Wyświetl/Ukryj wszystkie',
  columnsManagementReset: 'Resetuj',
  columnsManagementDeleteIconLabel: 'Wyczyść',

  // Filter panel text
  filterPanelAddFilter: 'Dodaj filtr',
  filterPanelRemoveAll: 'Usuń wszystkie',
  filterPanelDeleteIconLabel: 'Usuń',
  filterPanelLogicOperator: 'Operator logiczny',
  filterPanelOperator: 'Operator',
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'Lub',
  filterPanelColumns: 'Kolumny',
  filterPanelInputLabel: 'Wartość',
  filterPanelInputPlaceholder: 'Filtrowana wartość',

  // Filter operators text
  filterOperatorContains: 'zawiera',
  filterOperatorDoesNotContain: 'nie zawiera',
  filterOperatorEquals: 'równa się',
  filterOperatorDoesNotEqual: 'nie równa się',
  filterOperatorStartsWith: 'zaczyna się od',
  filterOperatorEndsWith: 'kończy się na',
  filterOperatorIs: 'równa się',
  filterOperatorNot: 'różne',
  filterOperatorAfter: 'większe niż',
  filterOperatorOnOrAfter: 'większe lub równe',
  filterOperatorBefore: 'mniejsze niż',
  filterOperatorOnOrBefore: 'mniejsze lub równe',
  filterOperatorIsEmpty: 'jest pusty',
  filterOperatorIsNotEmpty: 'nie jest pusty',
  filterOperatorIsAnyOf: 'jest jednym z',
  'filterOperator=': 'równa się',
  'filterOperator!=': 'nie równa się',
  'filterOperator>': 'większy niż',
  'filterOperator>=': 'większy lub równy',
  'filterOperator<': 'mniejszy niż',
  'filterOperator<=': 'mniejszy lub równy',

  // Header filter operators text
  headerFilterOperatorContains: 'Zawiera',
  headerFilterOperatorDoesNotContain: 'Nie zawiera',
  headerFilterOperatorEquals: 'Równa się',
  headerFilterOperatorDoesNotEqual: 'Nie równa się',
  headerFilterOperatorStartsWith: 'Zaczyna się od',
  headerFilterOperatorEndsWith: 'Kończy się na',
  headerFilterOperatorIs: 'Jest',
  headerFilterOperatorNot: 'Niepuste',
  headerFilterOperatorAfter: 'Jest po',
  headerFilterOperatorOnOrAfter: 'Jest w lub po',
  headerFilterOperatorBefore: 'Jest przed',
  headerFilterOperatorOnOrBefore: 'Jest w lub przed',
  headerFilterOperatorIsEmpty: 'Jest pusty',
  headerFilterOperatorIsNotEmpty: 'Nie jest pusty',
  headerFilterOperatorIsAnyOf: 'Is any of',
  'headerFilterOperator=': 'Równa się',
  'headerFilterOperator!=': 'Nie równa się',
  'headerFilterOperator>': 'Większy niż',
  'headerFilterOperator>=': 'Większy lub równy',
  'headerFilterOperator<': 'Mniejszy niż',
  'headerFilterOperator<=': 'Mniejszy lub równy',
  headerFilterClear: 'Wyczyść',

  // Filter values text
  filterValueAny: 'dowolny',
  filterValueTrue: 'prawda',
  filterValueFalse: 'fałsz',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Pokaż wszystkie kolumny',
  columnMenuManageColumns: 'Zarządzaj kolumnami',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Ukryj',
  columnMenuUnsort: 'Anuluj sortowanie',
  columnMenuSortAsc: 'Sortuj rosnąco',
  columnMenuSortDesc: 'Sortuj malejąco',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => `Liczba aktywnych filtrów: ${count}`,
  columnHeaderFiltersLabel: 'Pokaż filtry',
  columnHeaderSortIconLabel: 'Sortuj',

  // Rows selected footer text
  footerRowSelected: (count) => `Liczba wybranych wierszy: ${count.toLocaleString()}`,

  // Total row amount footer text
  footerTotalRows: 'Łączna liczba wierszy:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} z ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Pole wyboru',
  checkboxSelectionSelectAllRows: 'Zaznacz wszystkie wiersze',
  checkboxSelectionUnselectAllRows: 'Odznacz wszystkie wiersze',
  checkboxSelectionSelectRow: 'Zaznacz wiersz',
  checkboxSelectionUnselectRow: 'Odznacz wiersz',

  // Boolean cell text
  booleanCellTrueLabel: 'tak',
  booleanCellFalseLabel: 'nie',

  // Actions cell more text
  actionsCellMore: 'więcej',

  // Column pinning text
  pinToLeft: 'Przypnij do lewej',
  pinToRight: 'Przypnij do prawej',
  unpin: 'Odepnij',

  // Tree Data
  treeDataGroupingHeaderName: 'Grupa',
  treeDataExpand: 'pokaż elementy potomne',
  treeDataCollapse: 'ukryj elementy potomne',

  // Grouping columns
  groupingColumnHeaderName: 'Grupa',
  groupColumn: (name) => `Grupuj według ${name}`,
  unGroupColumn: (name) => `Rozgrupuj ${name}`,

  // Master/detail
  detailPanelToggle: 'Szczegóły',
  expandDetailPanel: 'Rozwiń',
  collapseDetailPanel: 'Zwiń',

  // Row reordering text
  rowReorderingHeaderName: 'Porządkowanie wierszy',

  // Aggregation
  aggregationMenuItemHeader: 'Agregacja',
  aggregationFunctionLabelSum: 'suma',
  aggregationFunctionLabelAvg: 'średnia',
  aggregationFunctionLabelMin: 'minimum',
  aggregationFunctionLabelMax: 'maximum',
  aggregationFunctionLabelSize: 'rozmiar',
};

export const plPL: Localization = getGridLocalization(plPLGrid, plPLCore);
