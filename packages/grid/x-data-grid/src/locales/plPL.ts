import { plPL as plPLCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const plPLGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Brak danych',
  noResultsOverlayLabel: 'Nie znaleziono wyników.',
  errorOverlayDefaultLabel: 'Wystąpił błąd.',

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

  // Export selector toolbar button text
  toolbarExport: 'Eksportuj',
  toolbarExportLabel: 'Eksportuj',
  toolbarExportCSV: 'Pobierz jako plik CSV',
  toolbarExportPrint: 'Drukuj',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Znajdź kolumnę',
  columnsPanelTextFieldPlaceholder: 'Tytuł kolumny',
  columnsPanelDragIconLabel: 'Zmień kolejność kolumn',
  columnsPanelShowAllButton: 'Pokaż wszystko',
  columnsPanelHideAllButton: 'Ukryj wszystko',

  // Filter panel text
  filterPanelAddFilter: 'Dodaj filtr',
  filterPanelDeleteIconLabel: 'Usuń',
  filterPanelLinkOperator: 'Operator logiczny',
  filterPanelOperators: 'Operator',

  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'I',
  filterPanelOperatorOr: 'Lub',
  filterPanelColumns: 'Kolumny',
  filterPanelInputLabel: 'Wartość',
  filterPanelInputPlaceholder: 'Filtrowana wartość',

  // Filter operators text
  filterOperatorContains: 'zawiera',
  filterOperatorEquals: 'równa się',
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

  // Filter values text
  filterValueAny: 'dowolny',
  filterValueTrue: 'prawda',
  filterValueFalse: 'fałsz',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Pokaż wszystkie kolumny',
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
  expandDetailPanel: 'Rozwiń',
  collapseDetailPanel: 'Zwiń',
};

export const plPL: Localization = getGridLocalization(plPLGrid, plPLCore);
