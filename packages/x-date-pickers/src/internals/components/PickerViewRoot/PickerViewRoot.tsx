import { styled } from '@mui/material/styles';
import type { PickerOwnerState } from '../../../models';
import {
  DIALOG_WIDTH,
  DIALOG_WIDTH_COMPACT,
  VIEW_HEIGHT,
  VIEW_HEIGHT_COMPACT,
} from '../../constants/dimensions';

export const PickerViewRoot = styled('div', {
  slot: 'internal',
  shouldForwardProp: undefined,
})<{ ownerState: PickerOwnerState }>({
  overflow: 'hidden',
  width: DIALOG_WIDTH,
  maxHeight: VIEW_HEIGHT,
  display: 'flex',
  flexDirection: 'column',
  margin: '0 auto',
  variants: [
    {
      props: { isPickerCompact: true },
      style: { width: DIALOG_WIDTH_COMPACT, maxHeight: VIEW_HEIGHT_COMPACT },
    },
  ],
});
