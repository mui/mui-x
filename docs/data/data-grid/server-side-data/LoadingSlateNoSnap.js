import CircularProgress from '@mui/material/CircularProgress';
import { lighten, darken, alpha, styled } from '@mui/material/styles';

function getBorderColor(theme) {
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

function getBorderRadius(theme) {
  const radius = theme.shape.borderRadius;
  return typeof radius === 'number' ? `${radius}px` : radius;
}

const StyledDiv = styled('div')(({ theme }) => ({
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  border: `1px solid ${getBorderColor(theme)}`,
  borderRadius: getBorderRadius(theme),
}));

export default function LoadingSlate() {
  return (
    <StyledDiv>
      <CircularProgress />
    </StyledDiv>
  );
}
