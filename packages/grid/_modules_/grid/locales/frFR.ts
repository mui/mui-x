import { frFR as frFRCore } from '@mui/material/locale';
import { GridLocaleText } from '../models/api/gridLocaleTextApi';
import { getGridLocalization, Localization } from '../utils/getGridLocalization';

const frFRGrid: Partial<GridLocaleText> = {
  // Root
  noRowsLabel: 'Pas de résultats',
  noResultsOverlayLabel: 'Aucun résultat.',
  errorOverlayDefaultLabel: 'Une erreur est apparue.',

  // Density selector toolbar button text
  toolbarDensity: 'Densité',
  toolbarDensityLabel: 'Densité',
  toolbarDensityCompact: 'Compact',
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

  // Export selector toolbar button text
  toolbarExport: 'Exporter',
  toolbarExportLabel: 'Exporter',
  toolbarExportCSV: 'Télécharger en CSV',

  // Columns panel text
  columnsPanelTextFieldLabel: 'Chercher colonne',
  columnsPanelTextFieldPlaceholder: 'Titre de la colonne',
  columnsPanelDragIconLabel: 'Réorganiser la colonne',
  columnsPanelShowAllButton: 'Tout afficher',
  columnsPanelHideAllButton: 'Tout cacher',

  // Filter panel text
  filterPanelAddFilter: 'Ajouter un filtre',
  filterPanelDeleteIconLabel: 'Supprimer',
  filterPanelOperators: 'Opérateurs',
  filterPanelOperatorAnd: 'Et',
  filterPanelOperatorOr: 'Ou',
  filterPanelColumns: 'Colonnes',
  filterPanelInputLabel: 'Valeur',
  filterPanelInputPlaceholder: 'Filtrer la valeur',

  // Filter operators text
  filterOperatorContains: 'contient',
  filterOperatorEquals: 'égal à',
  filterOperatorStartsWith: 'commence par',
  filterOperatorEndsWith: 'se termine par',
  filterOperatorIs: 'est',
  filterOperatorNot: "n'est pas",
  filterOperatorOnOrAfter: 'égal ou postérieur',
  filterOperatorAfter: 'postérieur',
  filterOperatorOnOrBefore: 'égal ou antérieur',
  filterOperatorBefore: 'antérieur',
  filterOperatorIsEmpty: 'est vide',
  filterOperatorIsNotEmpty: "n'est pas vide",

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Afficher les colonnes',
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

  // Total rows footer text
  footerTotalRows: 'Lignes totales :',

  // Total visible rows footer text
  footerTotalVisibleRows: (visibleCount, totalCount) =>
    `${visibleCount.toLocaleString()} sur ${totalCount.toLocaleString()}`,

  // Checkbox selection text
  checkboxSelectionHeaderName: 'Sélection',

  // Actions cell more text
  actionsCellMore: 'Plus',

  // Tree Data
  treeDataGroupingHeaderName: 'Groupe',
  treeDataExpand: 'afficher les enfants',
  treeDataCollapse: 'masquer les enfants',
};

export const frFR: Localization = getGridLocalization(frFRGrid, frFRCore);
