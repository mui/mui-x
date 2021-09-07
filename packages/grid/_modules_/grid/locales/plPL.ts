import { plPL as plPLCore } from '@material-ui/core/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

export const plPLGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Brak danych',
  // noResultsOverlayLabel: 'No results found.',
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

  // Columns panel text
  columnsPanelTextFieldLabel: 'Znajdź kolumnę',
  columnsPanelTextFieldPlaceholder: 'Tytuł kolumny',
  columnsPanelDragIconLabel: 'Zmień kolejność kolumn',
  columnsPanelShowAllButton: 'Pokaż wszystko',
  columnsPanelHideAllButton: 'Ukryj wszystko',

  // Filter panel text
  filterPanelAddFilter: 'Dodaj filtr',
  filterPanelDeleteIconLabel: 'Usuń',
  filterPanelOperators: 'Operator',
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
  // filterOperatorIsEmpty: 'is empty',
  // filterOperatorIsNotEmpty: 'is not empty',

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

  // Total rows footer text
  footerTotalRows: 'Łączna liczba wierszy:',

  // Total visible rows footer text
  // footerTotalVisibleRows: (visibleCount, totalCount) =>
  //   `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Actions cell more text
  // actionsCellMore: 'more',
};

export const plPL: Localization = getGridLocalization(plPLGrid, plPLCore);
