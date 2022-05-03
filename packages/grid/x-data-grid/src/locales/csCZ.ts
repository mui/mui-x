import { csCZ as csCZCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const csCZGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Žádné záznamy',
  noResultsOverlayLabel: 'Nenašli se žadné výsledky.',
  errorOverlayDefaultLabel: 'Stala sa nepředvídaná chyba.',

  // Density selector toolbar button text
  toolbarDensity: 'Hustota',
  toolbarDensityLabel: 'Hustota',
  toolbarDensityCompact: 'Kompaktní',
  toolbarDensityStandard: 'Standartní',
  toolbarDensityComfortable: 'Komfortní',

  // Columns selector toolbar button text
  toolbarColumns: 'Sloupce',
  toolbarColumnsLabel: 'Vybrat sloupec',

  // Filters toolbar button text
  toolbarFilters: 'Filtry',
  toolbarFiltersLabel: 'Zobrazit filtry',
  toolbarFiltersTooltipHide: 'Skrýt filtry',
  toolbarFiltersTooltipShow: 'Zobrazit filtry',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'aktivních filtrů';

    if (count > 1 && count < 5) {
      pluralForm = 'aktivní filtry';
    } else if (count === 1) {
      pluralForm = 'aktivní filtr';
    }

    return `${count} ${pluralForm}`;
  },

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Stáhnout jako CSV',
  toolbarExportPrint: 'Vytisknout',
  // toolbarExportExcel: 'Download as Excel',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Najít sloupec',
  columnsPanelTextFieldPlaceholder: 'Název sloupce',
  columnsPanelDragIconLabel: 'Uspořádat sloupce',
  columnsPanelShowAllButton: 'Zobrazit vše',
  columnsPanelHideAllButton: 'Skrýt vše',

  // Filter panel text
  filterPanelAddFilter: 'Přidat filtr',
  filterPanelDeleteIconLabel: 'Odstranit',
  // filterPanelLinkOperator: 'Logic operator',
  filterPanelOperators: 'Operátory',

  // TODO v6: rename to filterPanelOperator
  filterPanelOperatorAnd: 'A',
  filterPanelOperatorOr: 'Nebo',
  filterPanelColumns: 'Sloupce',
  filterPanelInputLabel: 'Hodnota',
  filterPanelInputPlaceholder: 'Hodnota filtru',

  // Filter operators text
  filterOperatorContains: 'obsahuje',
  filterOperatorEquals: 'rovná se',
  filterOperatorStartsWith: 'začíná s',
  filterOperatorEndsWith: 'končí na',
  filterOperatorIs: 'je',
  filterOperatorNot: 'není',
  filterOperatorAfter: 'je po',
  filterOperatorOnOrAfter: 'je na nebo po',
  filterOperatorBefore: 'je před',
  filterOperatorOnOrBefore: 'je na nebo dříve',
  filterOperatorIsEmpty: 'je prázdný',
  filterOperatorIsNotEmpty: 'není prázdný',
  // filterOperatorIsAnyOf: 'is any of',

  // Filter values text
  filterValueAny: 'jakýkoliv',
  filterValueTrue: 'ano',
  filterValueFalse: 'ne',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Zobrazit sloupce',
  columnMenuFilter: 'Filtr',
  columnMenuHideColumn: 'Skrýt',
  columnMenuUnsort: 'Zrušit filtry',
  columnMenuSortAsc: 'Seřadit vzestupně',
  columnMenuSortDesc: 'Seřadit sestupně',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'aktivních filtrů';

    if (count > 1 && count < 5) {
      pluralForm = 'aktivní filtry';
    } else if (count === 1) {
      pluralForm = 'aktivní filtr';
    }

    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Zobrazit filtry',
  columnHeaderSortIconLabel: 'Filtrovat',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'vybraných záznamů';

    if (count > 1 && count < 5) {
      pluralForm = 'vybrané záznamy';
    } else if (count === 1) {
      pluralForm = 'vybraný záznam';
    }

    return `${count} ${pluralForm}`;
  },

  // Total row amount footer text
  footerTotalRows: 'Celkem řádků:',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) => {
    const str = totalCount.toString();
    const firstDigit = str[0];
    const op =
      ['4', '6', '7'].includes(firstDigit) || (firstDigit === '1' && str.length % 3 === 0)
        ? 'ze'
        : 'z';
    return `${visibleCount.toLocaleString()} ${op} ${totalCount.toLocaleString()}`;
  },

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Výběr řádku',
  // checkboxSelectionSelectAllRows: 'Select all rows',
  // checkboxSelectionUnselectAllRows: 'Unselect all rows',
  // checkboxSelectionSelectRow: 'Select row',
  // checkboxSelectionUnselectRow: 'Unselect row',

  // Boolean cell text
  booleanCellTrueLabel: 'ano',
  booleanCellFalseLabel: 'ne',

  // Actions cell more text
  actionsCellMore: 'více',

  // Column pinning text
  pinToLeft: 'Připnout na levo',
  pinToRight: 'Připnout na pravo',
  unpin: 'Odepnout',

  // Tree Data
  treeDataGroupingHeaderName: 'Skupina',
  treeDataExpand: 'zobrazit potomky',
  treeDataCollapse: 'skrýt potomky',

  // Grouping columns
  groupingColumnHeaderName: 'Skupina',
  groupColumn: (name) => `Zoskupit podle ${name}`,
  unGroupColumn: (name) => `Přestat zoskupovat podle ${name}`,

  // Master/detail
  // expandDetailPanel: 'Expand',
  // collapseDetailPanel: 'Collapse',

  // Row reordering text
  // rowReorderingHeaderName: 'Row reordering',
};

export const csCZ: Localization = getGridLocalization(csCZGrid, csCZCore);
