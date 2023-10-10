import { createStyled } from '@mui/system';

// hardcode theme id to avoid importing from `@mui/material`
export const styled = createStyled({ themeId: '$$material' });
