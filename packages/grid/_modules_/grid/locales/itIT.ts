import { itIT as itITCore } from '@material-ui/core/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils';

const itITGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Nessun record',
  errorOverlayDefaultLabel: 'Si è verificato un errore.',

  // Density selector toolbar button text
  toolbarDensity: 'Densità',
  toolbarDensityLabel: 'Densità',
  toolbarDensityCompact: 'Compact',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Confortable',

  // Columns selector toolbar button text
  toolbarColumns: 'Colonne',
  toolbarColumnsLabel: 'Seleziona le colonne',

  // Filters toolbar button text
  toolbarFilters: 'Filtri',
  toolbarFiltersLabel: 'Mostra i filtri',
  toolbarFiltersTooltipHide: 'Nascondi i filtri',
  toolbarFiltersTooltipShow: 'Mostra i filtri',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtri attivi` : `${count} filtro attivo`,

  // Columns panel text
  columnsPanelTextFieldLabel: 'Cerca colonna',
  columnsPanelTextFieldPlaceholder: 'Titolo della colonna',
  columnsPanelDragIconLabel: 'Riordina la colonna',
  columnsPanelShowAllButton: 'Mostra tutto',
  columnsPanelHideAllButton: 'Nascondi tutto',

  // Filter panel text
  filterPanelAddFilter: 'Aggiungi un filtro',
  filterPanelDeleteIconLabel: 'Rimuovi',
  filterPanelOperators: 'Operatori',
  filterPanelOperatorAnd: 'E (and)',
  filterPanelOperatorOr: 'O (or)',
  filterPanelColumns: 'Colonne',
  filterPanelInputLabel: 'Valore',
  filterPanelInputPlaceholder: 'Filtra il valore',

  // Filter operators text
  filterOperatorContains: 'contiene',
  filterOperatorEquals: 'uguale a',
  filterOperatorStartsWith: 'comincia per',
  filterOperatorEndsWith: 'termina per',
  filterOperatorIs: 'uguale a',
  filterOperatorNot: 'diversa da',
  filterOperatorOnOrAfter: 'a partire dal',
  filterOperatorAfter: 'dopo il',
  filterOperatorOnOrBefore: 'fino al',
  filterOperatorBefore: 'prima del',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Mostra le colonne',
  columnMenuFilter: 'Filtra',
  columnMenuHideColumn: 'Nascondi',
  columnMenuUnsort: "Annulla l'ordinamento",
  columnMenuSortAsc: 'Ordinamento crescente',
  columnMenuSortDesc: 'Ordinamento decrescente',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtri attivi` : `${count} filtro attivo`,
  columnHeaderFiltersLabel: 'Mostra i filtri',
  columnHeaderSortIconLabel: 'Ordina',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1
      ? `${count.toLocaleString()} record selezionati`
      : `${count.toLocaleString()} record selezionato`,

  // Total rows footer text
  footerTotalRows: 'Record totali :',

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Seleziona',
};

export const itIT: Localization = getGridLocalization(itITGrid, itITCore);
