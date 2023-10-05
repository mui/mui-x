import { createStyled } from '@mui/system';

// hardcode theme id to avoid importing from @mui/material
const styled = createStyled({ themeId: '$$material' });

export default styled;