import { ChartsLocaleText } from './utils/chartsLocaleTextApi';
import { getChartsLocalization } from './utils/getChartsLocalization';

export const frFRLocalText: Partial<ChartsLocaleText> = {
  // Overlay
  loading: 'Chargement…',
  noData: 'Pas de données',

  // Toolbar
  // zoomIn: 'Zoom in',
  // zoomOut: 'Zoom out',
  // toolbarExport: 'Export',

  // Toolbar Export Menu
  // toolbarExportPrint: 'Print',
  // toolbarExportImage: mimeType => `Export as ${imageMimeTypes[mimeType] ?? mimeType}`,

  // Charts renderer configuration
  chartTypeBar: 'Barre',
  chartTypeColumn: 'Colonne',
  chartTypeLine: 'Ligne',
  chartTypeArea: 'Aire',
  chartTypePie: 'Camembert',
  chartPaletteLabel: 'Palette de couleurs',
  chartPaletteNameRainbowSurge: 'Vague Arc-en-ciel',
  chartPaletteNameBlueberryTwilight: 'Crépuscule Myrtille',
  chartPaletteNameMangoFusion: 'Fusion Mangue',
  chartPaletteNameCheerfulFiesta: 'Fiesta Joyeuse',
  chartPaletteNameStrawberrySky: 'Ciel Fraise',
  chartPaletteNameBlue: 'Bleu',
  chartPaletteNameGreen: 'Vert',
  chartPaletteNamePurple: 'Violet',
  chartPaletteNameRed: 'Rouge',
  chartPaletteNameOrange: 'Orange',
  chartPaletteNameYellow: 'Jaune',
  chartPaletteNameCyan: 'Cyan',
  chartPaletteNamePink: 'Rose',
  chartConfigurationSectionMain: 'Section principale',
  chartConfigurationSectionChart: 'Graphique',
  chartConfigurationSectionColumns: 'Colonnes',
  chartConfigurationSectionBars: 'Barres',
  chartConfigurationGrid: 'Grille',
  chartConfigurationGridHorizontal: 'Horizontale',
  chartConfigurationGridVertical: 'Verticale',
  chartConfigurationGridBoth: 'Les deux',
  chartConfigurationGridNone: 'Aucune',
  chartConfigurationBorderRadius: 'Rayon de bordure',
  chartConfigurationCategoryGapRatio: "Ratio d'espacement des catégories",
  chartConfigurationBarGapRatio: "Ratio d'espacement des séries",
  chartConfigurationStacked: 'Empilé',
  chartConfigurationSkipAnimation: "Ignorer l'animation",
  chartConfigurationInnerRadius: 'Rayon intérieur',
  chartConfigurationOuterRadius: 'Rayon extérieur',
  chartConfigurationColors: 'Couleurs',
  chartConfigurationHideLegend: 'Masquer la légende',
  chartConfigurationHeight: 'Hauteur',
  chartConfigurationWidth: 'Largeur',
  chartConfigurationSeriesGap: 'Espacement des séries',
  chartConfigurationTickPlacement: 'Placement des graduations',
  chartConfigurationTickPlacementStart: 'Début',
  chartConfigurationTickPlacementMiddle: 'Milieu',
  chartConfigurationTickPlacementEnd: 'Fin',
  chartConfigurationTickPlacementExtremities: 'Extrémités',
  chartConfigurationTickLabelPlacement: 'Placement des étiquettes',
  chartConfigurationTickLabelPlacementTick: 'Graduation',
  chartConfigurationTickLabelPlacementMiddle: 'Milieu',
};

export const frFR = getChartsLocalization(frFRLocalText);
