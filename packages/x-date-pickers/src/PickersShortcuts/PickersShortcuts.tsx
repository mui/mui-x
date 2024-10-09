'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import List, { ListProps } from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Chip from '@mui/material/Chip';
import { useTheme } from '@mui/material/styles';
import { VIEW_HEIGHT } from '../internals/constants/dimensions';

interface PickersShortcutsItemGetValueParams<TValue> {
  isValid: (value: TValue) => boolean;
}

export interface PickersShortcutsItem<TValue> {
  label: string;
  getValue: (params: PickersShortcutsItemGetValueParams<TValue>) => TValue;
  /**
   * Identifier of the shortcut.
   * If provided, it will be used as the key of the shortcut.
   */
  id?: string;
}

export type PickersShortcutsItemContext = Omit<PickersShortcutsItem<unknown>, 'getValue'>;

export type PickerShortcutChangeImportance = 'set' | 'accept';

export interface ExportedPickersShortcutProps<TValue> extends Omit<ListProps, 'onChange'> {
  /**
   * Ordered array of shortcuts to display.
   * If empty, does not display the shortcuts.
   * @default []
   */
  items?: PickersShortcutsItem<TValue>[];
  /**
   * Importance of the change when picking a shortcut:
   * - "accept": fires `onChange`, fires `onAccept` and closes the picker.
   * - "set": fires `onChange` but do not fire `onAccept` and does not close the picker.
   * @default "accept"
   */
  changeImportance?: PickerShortcutChangeImportance;
}

export interface PickersShortcutsProps<TValue> extends ExportedPickersShortcutProps<TValue> {
  isLandscape: boolean;
  onChange: (
    newValue: TValue,
    changeImportance: PickerShortcutChangeImportance,
    shortcut: PickersShortcutsItemContext,
  ) => void;
  isValid: (value: TValue) => boolean;
}

/**
 * Demos:
 *
 * - [Shortcuts](https://mui.com/x/react-date-pickers/shortcuts/)
 *
 * API:
 *
 * - [PickersShortcuts API](https://mui.com/x/api/date-pickers/pickers-shortcuts/)
 */
function PickersShortcuts<TValue>(props: PickersShortcutsProps<TValue>) {
  const { items, changeImportance = 'accept', isLandscape, onChange, isValid, ...other } = props;
  const theme = useTheme();
  const isLight = theme.palette.mode === 'light';

  const overflowGradient = {
    background: `
      linear-gradient(
        ${theme.palette.background.default} 30%,
        ${isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)'}
      ) center top / 100% 40px no-repeat,
      
      linear-gradient(
        ${isLight ? 'rgba(255, 255, 255, 0)' : 'rgba(0, 0, 0, 0)'}, 
        ${theme.palette.background.default} 70%
      ) center bottom / 100% 40px no-repeat,
      
      radial-gradient(
        farthest-side at 50% 0,
        ${isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(211, 211, 211, 0.2)'},
        ${theme.palette.background.default}
      ) center top / 85% 14px no-repeat,
      
      radial-gradient(
        farthest-side at 50% 100%,
        ${isLight ? 'rgba(0, 0, 0, 0.2)' : 'rgba(211, 211, 211, 0.2)'},
        ${theme.palette.background.default}
      ) center bottom / 85% 14px no-repeat
    `,
    backgroundAttachment: 'local, local, scroll, scroll',
  };

  if (items == null || items.length === 0) {
    return null;
  }

  const resolvedItems = items.map(({ getValue, ...item }) => {
    const newValue = getValue({ isValid });

    return {
      ...item,
      label: item.label,
      onClick: () => {
        onChange(newValue, changeImportance, item);
      },
      disabled: !isValid(newValue),
    };
  });

  return (
    <List
      dense
      sx={[
        {
          maxHeight: VIEW_HEIGHT,
          maxWidth: 200,
          scrollbarGutter: 'stable',
          overflow: 'hidden',
          '&:hover, &:focus-within': {
            overflow: 'auto',
          },
          ...overflowGradient,
        },
        ...(Array.isArray(other.sx) ? other.sx : [other.sx]),
      ]}
      {...other}
    >
      {resolvedItems.map((item) => {
        return (
          <ListItem key={item.id ?? item.label}>
            <Chip {...item} />
          </ListItem>
        );
      })}
    </List>
  );
}

PickersShortcuts.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  /**
   * Importance of the change when picking a shortcut:
   * - "accept": fires `onChange`, fires `onAccept` and closes the picker.
   * - "set": fires `onChange` but do not fire `onAccept` and does not close the picker.
   * @default "accept"
   */
  changeImportance: PropTypes.oneOf(['accept', 'set']),
  className: PropTypes.string,
  component: PropTypes.elementType,
  /**
   * If `true`, compact vertical padding designed for keyboard and mouse input is used for
   * the list and list items.
   * The prop is available to descendant components as the `dense` context.
   * @default false
   */
  dense: PropTypes.bool,
  /**
   * If `true`, vertical padding is removed from the list.
   * @default false
   */
  disablePadding: PropTypes.bool,
  isLandscape: PropTypes.bool.isRequired,
  isValid: PropTypes.func.isRequired,
  /**
   * Ordered array of shortcuts to display.
   * If empty, does not display the shortcuts.
   * @default []
   */
  items: PropTypes.arrayOf(
    PropTypes.shape({
      getValue: PropTypes.func.isRequired,
      id: PropTypes.string,
      label: PropTypes.string.isRequired,
    }),
  ),
  onChange: PropTypes.func.isRequired,
  style: PropTypes.object,
  /**
   * The content of the subheader, normally `ListSubheader`.
   */
  subheader: PropTypes.node,
  /**
   * The system prop that allows defining system overrides as well as additional CSS styles.
   */
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { PickersShortcuts };
