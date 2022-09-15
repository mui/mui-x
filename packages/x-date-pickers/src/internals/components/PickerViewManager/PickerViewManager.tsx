import * as React from 'react';
import { CalendarOrClockPickerView } from '../../models/views';
import { useViews } from '../../hooks/useViews';
import { PickerViewManagerProps } from './PickerViewManager.types';
import { styled } from '@mui/material/styles';
import { useIsLandscape } from '@mui/x-date-pickers/internals/hooks/useIsLandscape';

const PickersViewManagerRoot = styled('div')<{ ownerState: { isLandscape: boolean } }>(
  ({ ownerState }) => ({
    display: 'flex',
    flexDirection: 'column',
    ...(ownerState.isLandscape && {
      flexDirection: 'row',
    }),
  }),
);

let warnedOnceNotValidOpenTo = false;

export function PickerViewManager<TValue, TDate, TView extends CalendarOrClockPickerView>(
  props: PickerViewManagerProps<TValue, TDate, TView>,
) {
  const { views, openTo, renderViews, orientation, onViewChange, onChange, value, ...other } =
    props;
  const isLandscape = useIsLandscape(views, orientation);

  if (process.env.NODE_ENV !== 'production') {
    if (!warnedOnceNotValidOpenTo && !views.includes(openTo)) {
      console.warn(
        `MUI: \`openTo="${openTo}"\` is not a valid prop.`,
        `It must be an element of \`views=["${views.join('", "')}"]\`.`,
      );
      warnedOnceNotValidOpenTo = true;
    }
  }

  const { openView, setOpenView, handleChangeAndOpenNext } = useViews<TValue, TView>({
    view: undefined,
    views,
    openTo,
    onChange,
    onViewChange,
  });

  return (
    <PickersViewManagerRoot ownerState={{ isLandscape }}>
      {renderViews({
        value,
        view: openView,
        onViewChange: setOpenView,
        onChange: handleChangeAndOpenNext,
        views,
        ...other,
      })}
    </PickersViewManagerRoot>
  );
}
