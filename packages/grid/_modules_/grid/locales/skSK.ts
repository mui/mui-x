import { skSK as skSKCore } from '@material-ui/core/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils';

export const skSKGrid: Partial<GridLocaleText> = {
  // Root
  rootGridLabel: 'mriežka',
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
    const lastDigit = count % 10;

    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'aktívne filtre';
    } else if (lastDigit === 1) {
      pluralForm = 'aktívny filter';
    }

    return `${count} ${pluralForm}`;
  },

  // Export selector toolbar button text
  toolbarExport: 'Export',
  toolbarExportLabel: 'Export',
  toolbarExportCSV: 'Stiahnuť ako CSV',

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
    const lastDigit = count % 10;

    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'aktívne filtre';
    } else if (lastDigit === 1) {
      pluralForm = 'aktívny filter';
    }

    return `${count} ${pluralForm}`;
  },
  columnHeaderFiltersLabel: 'Zobraziť filtre',
  columnHeaderSortIconLabel: 'Filtrovať',

  // Rows selected footer text
  footerRowSelected: (count) => {
    let pluralForm = 'vybrané záznamy';
    const lastDigit = count % 10;

    if (lastDigit > 1 && lastDigit < 5) {
      pluralForm = 'vybraných záznamov';
    } else if (lastDigit === 1) {
      pluralForm = 'vybraný záznam';
    }

    return `${count} ${pluralForm}`;
  },

  // Total rows footer text
  footerTotalRows: 'Riadkov spolu:',

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Výber riadku',

  // Boolean cell text
  booleanCellTrueLabel: 'áno',
  booleanCellFalseLabel: 'nie',
};

export const skSK: Localization = getGridLocalization(skSKGrid, skSKCore);
