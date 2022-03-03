import { styled } from '@mui/material/styles';
import { DIALOG_WIDTH, VIEW_HEIGHT } from '../../constants/dimensions';

export const PickerViewRoot = styled('div')({
  overflowX: 'hidden',
  width: DIALOG_WIDTH,
  maxHeight: VIEW_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
});
