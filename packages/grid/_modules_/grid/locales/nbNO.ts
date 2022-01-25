import { nbNO as nbNOCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

import {GridLocaleText} from '@mui/x-data-grid';

const nbNOGrid: GridLocaleText = {
    // Root
    noRowsLabel: 'Ingen rader',
    noResultsOverlayLabel: 'Fant ingen resultat.',
    errorOverlayDefaultLabel: 'Det skjedde en feil.',

    // Density selector toolbar button text
    toolbarDensity: 'Tetthet',
    toolbarDensityLabel: 'Tetthet',
    toolbarDensityCompact: 'Kompakt',
    toolbarDensityStandard: 'Standard',
    toolbarDensityComfortable: 'Komfortabelt',

    // Columns selector toolbar button text
    toolbarColumns: 'Kolonner',
    toolbarColumnsLabel: 'Velg kolonner',

    // Filters toolbar button text
    toolbarFilters: 'Filter',
    toolbarFiltersLabel: 'Vis filter',
    toolbarFiltersTooltipHide: 'Skjul fitler',
    toolbarFiltersTooltipShow: 'Vis filter',
    toolbarFiltersTooltipActive: (count) => (count !== 1 ? `${count} aktive filter` : `${count} aktivt filter`),

    // Export selector toolbar button text
    toolbarExport: 'Eksporter',
    toolbarExportLabel: 'Eksporter',
    toolbarExportCSV: 'Last ned som CSV',
    toolbarExportPrint: 'Skriv ut',

    // Columns panel text
    columnsPanelTextFieldLabel: 'Finn kolonne',
    columnsPanelTextFieldPlaceholder: 'Kolonne tittel',
    columnsPanelDragIconLabel: 'Reorganiser kolonne',
    columnsPanelShowAllButton: 'Vis alle',
    columnsPanelHideAllButton: 'Skjul alle',

    // Filter panel text
    filterPanelAddFilter: 'Legg til filter',
    filterPanelDeleteIconLabel: 'Slett',
    filterPanelOperators: 'Operatører',
    filterPanelOperatorAnd: 'Og',
    filterPanelOperatorOr: 'Eller',
    filterPanelColumns: 'Kolonner',
    filterPanelInputLabel: 'Verdi',
    filterPanelInputPlaceholder: 'Filter verdi',

    // Filter operators text
    filterOperatorContains: 'inneholder',
    filterOperatorEquals: 'er lik',
    filterOperatorStartsWith: 'starter med',
    filterOperatorEndsWith: 'slutter med',
    filterOperatorIs: 'er',
    filterOperatorNot: 'er ikke',
    filterOperatorAfter: 'er etter',
    filterOperatorOnOrAfter: 'er på eller etter',
    filterOperatorBefore: 'er før',
    filterOperatorOnOrBefore: 'er på eller før',
    filterOperatorIsEmpty: 'er tom',
    filterOperatorIsNotEmpty: 'er ikke tom',

    // Filter values text
    filterValueAny: 'noen',
    filterValueTrue: 'sant',
    filterValueFalse: 'usant',

    // Column menu text
    columnMenuLabel: 'Meny',
    columnMenuShowColumns: 'Vis kolonner',
    columnMenuFilter: 'Filter',
    columnMenuHideColumn: 'Skjul',
    columnMenuUnsort: 'Usorter',
    columnMenuSortAsc: 'Sorter ØKENDE',
    columnMenuSortDesc: 'Sorter SYNKENDE',

    // Column header text
    columnHeaderFiltersTooltipActive: (count) => (count !== 1 ? `${count} aktive filter` : `${count} aktivt filter`),
    columnHeaderFiltersLabel: 'Vis filter',
    columnHeaderSortIconLabel: 'Sorter',

    // Rows selected footer text
    footerRowSelected: (count) =>
        count !== 1 ? `${count.toLocaleString()} rader valgt` : `${count.toLocaleString()} rad valgt`,

    // Total rows footer text
    footerTotalRows: 'Totalt antall rader:',

    // Total visible rows footer text
    footerTotalVisibleRows: (visibleCount, totalCount) =>
        `${visibleCount.toLocaleString()} av ${totalCount.toLocaleString()}`,

    // Checkbox selection text
    checkboxSelectionHeaderName: 'Avmerkingsboks valgt',

    // Boolean cell text
    booleanCellTrueLabel: 'sant',
    booleanCellFalseLabel: 'usant',

    // Actions cell more text
    actionsCellMore: 'mer',

    // Column pinning text
    pinToLeft: 'Fest til venstre',
    pinToRight: 'Fest til høyre',
    unpin: 'Løsne',

    // Tree Data
    treeDataGroupingHeaderName: 'Grupper',
    treeDataExpand: 'se barn',
    treeDataCollapse: 'skjul barn',

    // Grouping columns
    groupingColumnHeaderName: 'Grupper',
    groupColumn: (name) => `Grupper på ${name}`,
    unGroupColumn: (name) => `Stopp å grupper på ${name}`,

    // Used core components translation keys
    MuiTablePagination: {},
};


export const nbNO: Localization = getGridLocalization(nbNOGRID, nbNOCore
);
