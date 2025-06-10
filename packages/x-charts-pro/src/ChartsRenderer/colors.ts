import {
  blueberryTwilightPalette,
  mangoFusionPalette,
  cheerfulFiestaPalette,
  strawberrySkyPalette,
  rainbowSurgePalette,
  bluePalette,
  greenPalette,
  purplePalette,
  redPalette,
  orangePalette,
  yellowPalette,
  cyanPalette,
  pinkPalette,
  ChartsColorPaletteCallback,
} from '@mui/x-charts/colorPalettes';

export const getColorPallete = (palette: string): ChartsColorPaletteCallback | undefined => {
  switch (palette) {
    case 'blueberryTwilightPalette':
      return blueberryTwilightPalette;
    case 'mangoFusionPalette':
      return mangoFusionPalette;
    case 'cheerfulFiestaPalette':
      return cheerfulFiestaPalette;
    case 'strawberrySkyPalette':
      return strawberrySkyPalette;
    case 'rainbowSurgePalette':
      return rainbowSurgePalette;
    case 'bluePalette':
      return bluePalette;
    case 'greenPalette':
      return greenPalette;
    case 'purplePalette':
      return purplePalette;
    case 'redPalette':
      return redPalette;
    case 'orangePalette':
      return orangePalette;
    case 'yellowPalette':
      return yellowPalette;
    case 'cyanPalette':
      return cyanPalette;
    case 'pinkPalette':
      return pinkPalette;
    default:
      return undefined;
  }
};
