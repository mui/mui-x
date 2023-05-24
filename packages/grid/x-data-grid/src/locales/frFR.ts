import { frFR as frFRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const frFRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Pas de résultats',
  noResultsOverlayLabel: 'Aucun résultat.',

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
  toolbarFiltersTooltipHide: 'Cacher les filtres',
  toolbarFiltersTooltipShow: 'Afficher les filtres',
  toolbarFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtres actifs` : `${count} filtre actif`,

  // Quick filter toolbar field
  toolbarQuickFilterPlaceholder: 'Rechercher…',
  toolbarQuickFilterLabel: 'Recherche',
  toolbarQuickFilterDeleteIconLabel: 'Supprimer',

  // Export selector toolbar button text
  toolbarExport: 'Exporter',
  toolbarExportLabel: 'Exporter',
  toolbarExportCSV: 'Télécharger en CSV',
  toolbarExportPrint: 'Imprimer',
  toolbarExportExcel: 'Télécharger pour Excel',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Chercher une colonne',
  columnsPanelTextFieldPlaceholder: 'Titre de la colonne',
  columnsPanelDragIconLabel: 'Réorganiser la colonne',
  columnsPanelShowAllButton: 'Tout afficher',
  columnsPanelHideAllButton: 'Tout cacher',

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
  filterOperatorEquals: 'est égal à',
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
  // 'filterOperator=': '=',
  // 'filterOperator!=': '!=',
  // 'filterOperator>': '>',
  // 'filterOperator>=': '>=',
  // 'filterOperator<': '<',
  // 'filterOperator<=': '<=',

  // Header filter operators text
  // headerFilterOperatorContains: 'Contains',
  // headerFilterOperatorEquals: 'Equals',
  // headerFilterOperatorStartsWith: 'Starts with',
  // headerFilterOperatorEndsWith: 'Ends with',
  // headerFilterOperatorIs: 'Is',
  // headerFilterOperatorNot: 'Is not',
  // headerFilterOperatorAfter: 'Is after',
  // headerFilterOperatorOnOrAfter: 'Is on or after',
  // headerFilterOperatorBefore: 'Is before',
  // headerFilterOperatorOnOrBefore: 'Is on or before',
  // headerFilterOperatorIsEmpty: 'Is empty',
  // headerFilterOperatorIsNotEmpty: 'Is not empty',
  // headerFilterOperatorIsAnyOf: 'Is any of',
  // 'headerFilterOperator=': 'Equals',
  // 'headerFilterOperator!=': 'Not equals',
  // 'headerFilterOperator>': 'Is greater than',
  // 'headerFilterOperator>=': 'Is greater than or equal to',
  // 'headerFilterOperator<': 'Is less than',
  // 'headerFilterOperator<=': 'Is less than or equal to',

  // Filter values text
  filterValueAny: 'tous',
  filterValueTrue: 'vrai',
  filterValueFalse: 'faux',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Afficher les colonnes',
  columnMenuManageColumns: 'Gérer les colonnes',
  columnMenuFilter: 'Filtrer',
  columnMenuHideColumn: 'Cacher',
  columnMenuUnsort: 'Annuler le tri',
  columnMenuSortAsc: 'Tri ascendant',
  columnMenuSortDesc: 'Tri descendant',

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

  // Row reordering text
  rowReorderingHeaderName: 'Positionnement des lignes',

  // Aggregation
  aggregationMenuItemHeader: 'Agrégation',
  aggregationFunctionLabelSum: 'Somme',
  aggregationFunctionLabelAvg: 'Moyenne',
  aggregationFunctionLabelMin: 'Minimum',
  aggregationFunctionLabelMax: 'Maximum',
  aggregationFunctionLabelSize: "Nombre d'éléments",
};

export const frFR: Localization = getGridLocalization(frFRGrid, frFRCore);
