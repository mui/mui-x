import * as React from 'react';
import { alpha, darken, lighten, type Theme } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';
import { hash } from '@mui/x-internals/hash';
import { vars, type GridCSSVariablesInterface } from '../constants/cssVariables';

export function useMaterialCSSVariables() {
  const theme = useTheme();
  return React.useMemo(() => {
    const id = hash(JSON.stringify(theme));
    const variables = transformTheme(theme);
    return { id, variables };
  }, [theme]);
}

function transformTheme(t: Theme): GridCSSVariablesInterface {
  const borderColor = getBorderColor(t);
  const mutedBorderColor = getMutedBorderColor(t, borderColor);
  const dataGridPalette = (t.palette as any).DataGrid; // FIXME: docs typecheck error

  const backgroundBase = dataGridPalette?.bg ?? (t.vars || t).palette.background.default;
  const backgroundHeader = dataGridPalette?.headerBg ?? backgroundBase;
  const backgroundPinned = dataGridPalette?.pinnedBg ?? backgroundBase;
  const backgroundBackdrop = t.vars
    ? `rgba(${t.vars.palette.background.defaultChannel} / ${t.vars.palette.action.disabledOpacity})`
    : alpha(t.palette.background.default, t.palette.action.disabledOpacity);

  const selectedColor = t.vars
    ? `rgb(${t.vars.palette.primary.mainChannel})`
    : t.palette.primary.main;

  const k = vars.keys;

  return {
    [k.spacingUnit]: t.spacing(1),

    [k.colors.border.base]: borderColor,
    [k.colors.border.muted]: mutedBorderColor,
    [k.colors.background.base]: backgroundBase,
    [k.colors.background.overlay]:
      t.palette.mode === 'dark'
        ? `color-mix(in srgb, ${t.palette.background.paper} 95%, #fff)`
        : t.palette.background.paper,
    [k.colors.background.backdrop]: backgroundBackdrop,
    [k.colors.foreground.base]: t.palette.text.primary,
    [k.colors.foreground.muted]: t.palette.text.secondary,
    [k.colors.foreground.accent]: t.palette.primary.dark,
    [k.colors.foreground.disabled]: t.palette.text.disabled,
    [k.colors.interactive.hover]: t.palette.action.hover,
    [k.colors.interactive.hoverOpacity]: t.palette.action.hoverOpacity,
    [k.colors.interactive.focus]: t.palette.primary.main,
    [k.colors.interactive.focusOpacity]: t.palette.action.focusOpacity,
    [k.colors.interactive.disabled]: t.palette.action.disabled,
    [k.colors.interactive.disabledOpacity]: t.palette.action.disabledOpacity,
    [k.colors.interactive.selected]: selectedColor,
    [k.colors.interactive.selectedOpacity]: t.palette.action.selectedOpacity,

    [k.header.background.base]: backgroundHeader,
    [k.cell.background.pinned]: backgroundPinned,

    [k.radius.base]:
      typeof t.shape.borderRadius === 'number' ? `${t.shape.borderRadius}px` : t.shape.borderRadius,

    [k.typography.fontFamily.base]: t.typography.fontFamily as string,
    [k.typography.fontWeight.light]: t.typography.fontWeightLight as string,
    [k.typography.fontWeight.regular]: t.typography.fontWeightRegular as string,
    [k.typography.fontWeight.medium]: t.typography.fontWeightMedium as string,
    [k.typography.fontWeight.bold]: t.typography.fontWeightBold as string,
    [k.typography.body.fontFamily]: t.typography.body2.fontFamily as string,
    [k.typography.body.fontSize]: t.typography.body2.fontSize as string,
    [k.typography.body.fontWeight]: t.typography.body2.fontWeight as string,
    [k.typography.body.letterSpacing]: t.typography.body2.letterSpacing as string,
    [k.typography.body.lineHeight]: t.typography.body2.lineHeight as string,
    [k.typography.small.fontFamily]: t.typography.caption.fontFamily as string,
    [k.typography.small.fontSize]: t.typography.caption.fontSize as string,
    [k.typography.small.fontWeight]: t.typography.caption.fontWeight as string,
    [k.typography.small.letterSpacing]: t.typography.caption.letterSpacing as string,
    [k.typography.small.lineHeight]: t.typography.caption.lineHeight as string,
    [k.typography.large.fontFamily]: t.typography.body1.fontFamily as string,
    [k.typography.large.fontSize]: t.typography.body1.fontSize as string,
    [k.typography.large.fontWeight]: t.typography.body1.fontWeight as string,
    [k.typography.large.letterSpacing]: t.typography.body1.letterSpacing as string,
    [k.typography.large.lineHeight]: t.typography.body1.lineHeight as string,

    [k.transitions.easing.easeIn]: t.transitions.easing.easeIn,
    [k.transitions.easing.easeOut]: t.transitions.easing.easeOut,
    [k.transitions.easing.easeInOut]: t.transitions.easing.easeInOut,
    [k.transitions.duration.short]: `${t.transitions.duration.shorter}ms`,
    [k.transitions.duration.base]: `${t.transitions.duration.short}ms`,
    [k.transitions.duration.long]: `${t.transitions.duration.standard}ms`,

    [k.shadows.base]: t.shadows[2],
    [k.shadows.overlay]: t.shadows[8],

    [k.zIndex.panel]: t.zIndex.modal,
    [k.zIndex.menu]: t.zIndex.modal,
  };
}

function getBorderColor(theme: Theme) {
  if (theme.vars) {
    return theme.vars.palette.TableCell.border;
  }
  if (theme.palette.mode === 'light') {
    return lighten(alpha(theme.palette.divider, 1), 0.88);
  }
  return darken(alpha(theme.palette.divider, 1), 0.68);
}

function getMutedBorderColor(theme: Theme, borderColor: string) {
  if (theme.vars) {
    return `color-mix(in srgb, ${borderColor} 60%, #fff)`;
  }
  return alpha(borderColor, 0.6);
}
