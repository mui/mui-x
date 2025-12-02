export type ChartsColorPaletteCallback = (mode: 'light' | 'dark') => string[];
export type ChartsColorPalette = readonly string[] | ChartsColorPaletteCallback;
export type ChartsColorCallback = (mode: 'light' | 'dark') => string;
export type ChartsColor = string | ChartsColorCallback;
