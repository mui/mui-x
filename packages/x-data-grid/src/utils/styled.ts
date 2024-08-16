import { createStyled } from '@mui/system';

// Hardcoded theme id to avoid importing from `@mui/material`
const MATERIAL_THEME_ID = '$$material';

export const styled = createStyled({ themeId: MATERIAL_THEME_ID });
