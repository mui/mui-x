import { PaletteMode } from '@mui/material';

/**
 * The selection API interface that is available in the grid [[apiRef]].
 */
export interface GridThemeApi {
  /**
   * Set the `theme.palette.mode` of the grid
   * @param {PaletteMode | undefined} mode The mode to use. Set `undefined` to inherit the theme mode.
   */
  setThemeMode: (mode: PaletteMode | undefined) => void;
}
