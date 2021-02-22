import { getLocalization, Localization } from '../utils';

export const frFR: Localization = getLocalization({
  // Root
  rootGridLabel: 'grid',
  noRowsLabel: 'Pas de résultats',
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
    count > 1 ? `${count} filtre(s) actif(s)` : `${count} filtre actif`,

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
  filterPanelInputPlaceholder: 'Filrer la valeur',

  // Filter operators text
  filterOperatorContains: 'contient',
  filterOperatorEquals: 'égal à',
  filterOperatorStartsWith: 'commence par',
  filterOperatorEndsWith: 'se termine par',
  filterOperatorIs: 'est',
  filterOperatorNot: "n'est pas",
  filterOperatorOnOrAfter: 'égal ou postérieur',
  filterOperatorAfter: 'postérieur',
  filterOperatorOnOrBefore: 'égal ou postérieur',
  filterOperatorBefore: 'antérieur',

  // Column menu text
  columnMenuLabel: 'Menu',
  columnMenuShowColumns: 'Afficher les colonnes',
  columnMenuFilter: 'Filtre',
  columnMenuHideColumn: 'Cacher',
  columnMenuUnsort: 'Unsort',
  columnMenuSortAsc: 'Tri ascendant',
  columnMenuSortDesc: 'Tri descendant',

  // Column header text
  columnHeaderFiltersTooltipActive: (count) =>
    count > 1 ? `${count} filtre(s) actif(s)` : `${count} filtre actif`,
  columnHeaderFiltersLabel: 'Afficher les filtres',
  columnHeaderSortIconLabel: 'Trier',

  // Rows selected footer text
  footerRowSelected: (count) =>
    count !== 1
      ? `${count.toLocaleString()} lignes sélectionnées`
      : `${count.toLocaleString()} ligne sélectionnée`,

  // Total rows footer text
  footerTotalRows: 'Lignes totale:',

  // Pagination footer text
  footerPaginationRowsPerPage: 'Lignes par page :',
});
