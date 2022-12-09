import * as React from 'react';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import { DateOrTimeView, useUtils } from '../internals';
// import { useLocaleText } from '@mui/x-date-pickers/src/internals/hooks/useUtils';

export interface PickersShortcutsItems<TDate> {
  label: string;
  getValue: (value: TDate, view: any, isValid: (value: TDate) => boolean, adapter: any) => TDate;
  // getIsDisabled: (isValid: (value: TDate) => boolean) => (value: TDate) => boolean;
}

export interface PickersShortcutsProps<TValue, TView extends DateOrTimeView>
  extends Omit<ListProps, 'onChange'> {
  /**
   * Ordered array of shortcuts to display.
   * If empty, does not display the shortcuts.
   * @default `[]`
   */
  shortcuts?: PickersShortcutsItems<unknown>[];
  isLandscape: boolean;
  onChange: (newValue: TValue) => void;
  value?: TValue;
  view: TView | null;
  onViewChange?: (view: TView) => void;
  views: readonly TView[];
  isValid: (value: TValue) => boolean;
}

export function PickersShortcuts<TDate, TView extends DateOrTimeView>(
  props: PickersShortcutsProps<TDate, TView>,
) {
  const { shortcuts, isLandscape, onChange, value, view, onViewChange, isValid, views, ...other } =
    props;
  const utils = useUtils<TDate>();

  const items = shortcuts?.map((item) => {
    console.log(item);
    const newValue = item?.getValue?.(value, view, isValid, utils) ?? [null, null];

    return {
      label: item.label,
      onClick: () => onChange(newValue),
      // disabled: !isValid(newValue),
    };
  });

  // getIsDisabled(isDisabled)
  // setValue
  // const localeText = useLocaleText();

  if (shortcuts == null || shortcuts.length === 0) {
    return null;
  }

  return (
    <List {...other}>
      {items.map((item) => (
        <ListItem key={item.label}>
          <Chip {...item} />
        </ListItem>
      ))}
    </List>
  );
}
