export type Themes = 'default' | 'md3' | 'custom';

export type PaletteMode = 'light' | 'dark';
export type Layout = 'horizontal' | 'vertical';
export type Corner = 'medium' | 'rectangular' | 'rounded';
export type TypographyType = 'default' | 'Inter' | 'Menlo';

export type Config = {
  selectedTheme: Themes;
  color: string;
  layout: Layout;
  density: 'medium' | 'compact';
  corner: Corner;
  typography: TypographyType;
};
