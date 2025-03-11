import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const frFRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Pas de résultats',
  noResultsOverlayLabel: 'Aucun résultat.',
  // noColumnsOverlayLabel: 'No columns',
  // noColumnsOverlayManageColumns: 'Manage columns',
  // emptyPivotOverlayLabel: 'Add fields to rows, columns, and values to create a pivot table',
  // emptyPivotOverlayManagePivot: 'Manage pivot',

  // Density selector toolbar button text
  toolbarDensity: 'Densité',
  toolbarDensityLabel: 'Densité',
  toolbarDensityCompact: 'Compacte',
  toolbarDensityStandard: 'Standard',
  toolbarDensityComfortable: 'Confortable',

  // Columns selector toolbar button text
  toolbarColumns: 'Colonnes',
  toolbarColumnsLabel: 'Choisir les colonnes',

  // Filters toolbar button text
  toolbarFilters: 'Filtres',
  toolbarFiltersLabel: 'Afficher les filtres',
  toolbarFiltersTooltipHide: 'Masquer les filtres',
  toolbarFiltersTooltipShow: 'Afficher les filtres',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtres actifs` : `${count} filtre actif`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Rechercher…',
  toolbarQuickFilterLabel: 'Recherche',
  toolbarQuickFilterDeleteIconLabel: 'Supprimer',

  // Prompt toolbar field
  // toolbarPromptControlPlaceholder: 'Type a prompt…',
  // toolbarPromptControlWithRecordingPlaceholder: 'Type or record a prompt…',
  // toolbarPromptControlRecordingPlaceholder: 'Listening for prompt…',
  // toolbarPromptControlLabel: 'Prompt input',
  // toolbarPromptControlRecordButtonDefaultLabel: 'Record',
  // toolbarPromptControlRecordButtonActiveLabel: 'Stop recording',
  // toolbarPromptControlSendActionLabel: 'Send',
  // toolbarPromptControlSendActionAriaLabel: 'Send prompt',
  // toolbarPromptControlErrorMessage: 'An error occurred while processing the request. Please try again with a different prompt.',

  // Export selector toolbar button text
  toolbarExport: 'Exporter',
  toolbarExportLabel: 'Exporter',
  toolbarExportCSV: 'Télécharger en CSV',
  toolbarExportPrint: 'Imprimer',
  toolbarExportExcel: 'Télécharger pour Excel',

  // Toolbar pivot button
  // toolbarPivot: 'Pivot',

  // Columns management text
  columnsManagementSearchTitle: 'Rechercher',
  columnsManagementNoColumns: 'Pas de colonnes',
  columnsManagementShowHideAllText: 'Afficher/masquer toutes',
  columnsManagementReset: 'Réinitialiser',
  // columnsManagementDeleteIconLabel: 'Clear',

  // Filter panel text
  filterPanelAddFilter: 'Ajouter un filtre',
  filterPanelRemoveAll: 'Tout supprimer',
  filterPanelDeleteIconLabel: 'Supprimer',
  filterPanelLogicOperator: 'Opérateur logique',
  filterPanelOperator: 'Opérateur',
  filterPanelOperatorAnd: 'Et',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colonne',
  filterPanelInputLabel: 'Valeur',
  filterPanelInputPlaceholder: 'Filtrer la valeur',

  // Filter operators text
  filterOperatorContains: 'contient',
  filterOperatorDoesNotContain: 'ne contient pas',
  filterOperatorEquals: 'est égal à',
  filterOperatorDoesNotEqual: "n'est pas égal à",
  filterOperatorStartsWith: 'commence par',
  filterOperatorEndsWith: 'se termine par',
  filterOperatorIs: 'est',
  filterOperatorNot: "n'est pas",
  filterOperatorAfter: 'postérieur',
  filterOperatorOnOrAfter: 'égal ou postérieur',
  filterOperatorBefore: 'antérieur',
  filterOperatorOnOrBefore: 'égal ou antérieur',
  filterOperatorIsEmpty: 'est vide',
  filterOperatorIsNotEmpty: "n'est pas vide",
  filterOperatorIsAnyOf: 'fait partie de',
  'filterOperator=': '=',
  'filterOperator!=': '!=',
  'filterOperator>': '>',
  'filterOperator>=': '>=',
  'filterOperator<': '<',
  'filterOperator<=': '<=',

  // Header filter operators text
  headerFilterOperatorContains: 'Contient',
  headerFilterOperatorDoesNotContain: 'Ne contient pas',
  headerFilterOperatorEquals: 'Est égal à',
  headerFilterOperatorDoesNotEqual: "N'est pas égal à",
  headerFilterOperatorStartsWith: 'Commence par',
  headerFilterOperatorEndsWith: 'Se termine par',
  headerFilterOperatorIs: 'Est',
  headerFilterOperatorNot: "N'est pas",
  headerFilterOperatorAfter: 'Postérieur',
  headerFilterOperatorOnOrAfter: 'Égal ou postérieur',
  headerFilterOperatorBefore: 'Antérieur',
  headerFilterOperatorOnOrBefore: 'Égal ou antérieur',
  headerFilterOperatorIsEmpty: 'Est vide',
  headerFilterOperatorIsNotEmpty: "N'est pas vide",
  headerFilterOperatorIsAnyOf: 'Fait partie de',
  'headerFilterOperator=': 'Est égal à',
  'headerFilterOperator!=': "N'est pas égal à",
  'headerFilterOperator>': 'Est supérieur à',
  'headerFilterOperator>=': 'Est supérieur ou égal à',
  'headerFilterOperator<': 'Est inférieur à',
  'headerFilterOperator<=': 'Est inférieur ou égal à',
  // headerFilterClear: 'Clear filter',

  // Filter values text
  filterValueAny: 'tous',
  filterValueTrue: 'vrai',
  filterValueFalse: 'faux',

  // Column menu text
  columnMenuLabel: 'Menu',
  // columnMenuAriaLabel: (columnName: string) => `${columnName} column menu`,
  columnMenuShowColumns: 'Afficher les colonnes',
  columnMenuManageColumns: 'Gérer les colonnes',
  columnMenuFilter: 'Filtrer',
  columnMenuHideColumn: 'Masquer',
  columnMenuUnsort: 'Annuler le tri',
  columnMenuSortAsc: 'Tri ascendant',
  columnMenuSortDesc: 'Tri descendant',
  // columnMenuManagePivot: 'Manage pivot',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtres actifs` : `${count} filtre actif`,
  columnHeaderFiltersLabel: 'Afficher les filtres',
  columnHeaderSortIconLabel: 'Trier',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count > 1
      ? `${count.toLocaleString()} lignes sélectionnées`
      : `${count.toLocaleString()} ligne sélectionnée`,

  // Total row amount footer text
  footerTotalRows: 'Total de lignes :',

  // Total visible row amount footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} sur ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Sélection',
  checkboxSelectionSelectAllRows: 'Sélectionner toutes les lignes',
  checkboxSelectionUnselectAllRows: 'Désélectionner toutes les lignes',
  checkboxSelectionSelectRow: 'Sélectionner la ligne',
  checkboxSelectionUnselectRow: 'Désélectionner la ligne',

  // Boolean cell text
  booleanCellTrueLabel: 'vrai',
  booleanCellFalseLabel: 'faux',

  // Actions cell more text
  actionsCellMore: 'Plus',

  // Column pinning text
  pinToLeft: 'Épingler à gauche',
  pinToRight: 'Épingler à droite',
  unpin: 'Désépingler',

  // Tree Data
  treeDataGroupingHeaderName: 'Groupe',
  treeDataExpand: 'afficher les enfants',
  treeDataCollapse: 'masquer les enfants',

  // Grouping columns
  groupingColumnHeaderName: 'Groupe',
  groupColumn: (name) => `Grouper par ${name}`,
  unGroupColumn: (name) => `Arrêter de grouper par ${name}`,

  // Master/detail
  detailPanelToggle: 'Afficher/masquer les détails',
  expandDetailPanel: 'Afficher',
  collapseDetailPanel: 'Masquer',

  // Pagination
  paginationRowsPerPage: 'Lignes par page :',
  // paginationDisplayedRows: ({
  //   from,
  //   to,
  //   count,
  //   estimated
  // }) => {
  //   if (!estimated) {
  //     return `${from}–${to} of ${count !== -1 ? count : `more than ${to}`}`;
  //   }
  //   const estimatedLabel = estimated && estimated > to ? `around ${estimated}` : `more than ${to}`;
  //   return `${from}–${to} of ${count !== -1 ? count : estimatedLabel}`;
  // },
  paginationItemAriaLabel: (type) => {
    if (type === 'first') {
      return 'Aller à la première page';
    }
    if (type === 'last') {
      return 'Aller à la dernière page';
    }
    if (type === 'next') {
      return 'Aller à la page suivante';
    }
    // if (type === 'previous') {
    return 'Aller à la page précédente';
  },

  // Row reordering text
  rowReorderingHeaderName: 'Positionnement des lignes',

  // Aggregation
  aggregationMenuItemHeader: 'Agrégation',
  aggregationFunctionLabelSum: 'Somme',
  aggregationFunctionLabelAvg: 'Moyenne',
  aggregationFunctionLabelMin: 'Minimum',
  aggregationFunctionLabelMax: 'Maximum',
  aggregationFunctionLabelSize: "Nombre d'éléments",

  // Pivot panel
  // pivotToggleLabel: 'Pivot',
  // pivotRows: 'Rows',
  // pivotColumns: 'Columns',
  // pivotValues: 'Values',
  // pivotCloseButton: 'Close pivot settings',
  // pivotSearchButton: 'Search fields',
  // pivotSearchControlPlaceholder: 'Search fields',
  // pivotSearchControlLabel: 'Search fields',
  // pivotSearchControlClear: 'Clear search',
  // pivotNoFields: 'No fields',
  // pivotMenuMoveUp: 'Move up',
  // pivotMenuMoveDown: 'Move down',
  // pivotMenuMoveToTop: 'Move to top',
  // pivotMenuMoveToBottom: 'Move to bottom',
  // pivotMenuRows: 'Rows',
  // pivotMenuColumns: 'Columns',
  // pivotMenuValues: 'Values',
  // pivotMenuOptions: 'Field options',
  // pivotMenuAddToRows: 'Add to Rows',
  // pivotMenuAddToColumns: 'Add to Columns',
  // pivotMenuAddToValues: 'Add to Values',
  // pivotMenuRemove: 'Remove',
  // pivotDragToRows: 'Drag here to create rows',
  // pivotDragToColumns: 'Drag here to create columns',
  // pivotDragToValues: 'Drag here to create values',

  // Sidebar
  // sidebarExpandSection: name => `Expand ${name}`,
  // sidebarCollapseSection: name => `Collapse ${name}`,
};

export const frFR: Localization = getGridLocalization(frFRGrid);
