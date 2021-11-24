import { skSK as skSKCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const skSKGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Žiadne záznamy',
  noResultsOverlayLabel: 'Nenašli sa žadne výsledky.',
  errorOverlayDefaultLabel: 'Stala sa nepredvídaná chyba.',

  // Density selector toolbar button text
  toolbarDensity: 'Hustota',
  toolbarDensityLabel: 'Hustota',
  toolbarDensityCompact: 'Kompaktná',
  toolbarDensityStandard: 'Štandartná',
  toolbarDensityComfortable: 'Komfortná',

  // Columns selector toolbar button text
  toolbarColumns: 'Stĺpce',
  toolbarColumnsLabel: 'Vybrať stĺpce',

  // Filters toolbar button text
  toolbarFilters: 'Filtre',
  toolbarFiltersLabel: 'Zobraziť filtre',
  toolbarFiltersTooltipHide: 'Skryť filtre ',
  toolbarFiltersTooltipShow: 'Zobraziť filtre',
  toolbarFiltersTooltipActive: (count) => {
    let pluralForm = 'aktívnych filtrov';

    if (count > 1 && count < 5) {
      pluralForm = 'aktívne filtre';
    } else if (count === 1) {
      pluralForm = 'aktívny filter';
    }

    return `${count} ${pluralForm}`;
  },

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Stiahnuť ako CSV',
  // toolbarExportPrint: 'Print',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Nájsť stĺpec',
  columnsPanelTextFieldPlaceholder: 'Názov stĺpca',
  columnsPanelDragIconLabel: 'Usporiadť stĺpce',
  columnsPanelShowAllButton: 'Zobraziť všetko',
  columnsPanelHideAllButton: 'Skryť všetko',

  // Filter panel text
  filterPanelAddFilter: 'Pridať filter',
  filterPanelDeleteIconLabel: 'Odstrániť',
  filterPanelOperators: 'Operátory',
  filterPanelOperatorAnd: 'A',
  filterPanelOperatorOr: 'Alebo',
  filterPanelColumns: 'Stĺpce',
  filterPanelInputLabel: 'Hodnota',
  filterPanelInputPlaceholder: 'Hodnota filtra',

  // Filter operators text
  filterOperatorContains: 'obsahuje',
  filterOperatorEquals: 'rovná sa',
  filterOperatorStartsWith: 'začína s',
  filterOperatorEndsWith: 'končí na',
  filterOperatorIs: 'je',
  filterOperatorNot: 'nie je',
  filterOperatorAfter: 'je po',
  filterOperatorOnOrAfter: 'je na alebo po',
  filterOperatorBefore: 'je pred',
  filterOperatorOnOrBefore: 'je na alebo skôr',
  // filterOperatorIsEmpty: 'is empty',
  // filterOperatorIsNotEmpty: 'is not empty',

  // Filter values text
  filterValueAny: 'akýkoľvek',
  filterValueTrue: 'áno',
  filterValueFalse: 'nie',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Zobraziť stĺpce',
  columnMenuFilter: 'Filter',
  columnMenuHideColumn: 'Skryť',
  columnMenuUnsort: 'Zrušiť filtre',
  columnMenuSortAsc: 'Zoradiť vzostupne',
  columnMenuSortDesc: 'Zoradiť zostupne',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) => {
    let pluralForm = 'aktívnych filtrov';

    if (count > 1 && count < 5) {
      pluralForm = 'aktívne filtre';
    } else if (count === 1) {
      pluralForm = 'aktívny filter';
    }

    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Zobraziť filtre',
  columnHeaderSortIconLabel: 'Filtrovať',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'vybraných záznamov';

    if (count > 1 && count < 5) {
      pluralForm = 'vybrané záznamy';
    } else if (count === 1) {
      pluralForm = 'vybraný záznam';
    }

    return `${count} ${pluralForm}`;
  },

  // Total rows footer text
  footerTotalRows: 'Riadkov spolu:',

  // Total visible rows footer text
  // footerTotalVisibleRows: (visibleCount, totalCount) => `${visibleCount.toLocaleString()} of ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Výber riadku',

  // Boolean cell text
  booleanCellTrueLabel: 'áno',
  booleanCellFalseLabel: 'nie',

  // Actions cell more text
  // actionsCellMore: 'more',

  // Tree Data
  // treeDataGroupingHeaderName: 'Group',
  // treeDataExpand: 'see children',
  // treeDataCollapse: 'hide children',
};

export const skSK: Localization = getGridLocalization(skSKGrid, skSKCore);
