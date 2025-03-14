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
  const dataGridPalette = (t.palette as any).DataGrid; // FIXME: docs typecheck error

  const backgroundBase = dataGridPalette?.bg ?? (t.vars || t).palette.background.default;
  const backgroundHeader = dataGridPalette?.headerBg ?? backgroundBase;
  const backgroundPinned = dataGridPalette?.pinnedBg ?? backgroundBase;
  const backgroundBackdrop = t.vars
    ? `rgba(${t.vars.palette.background.defaultChannel} / ${t.vars.palette.action.disabledOpacity})`
    : alpha(t.palette.background.default, t.palette.action.disabledOpacity);
  const backgroundOverlay =
    t.palette.mode === 'dark'
      ? `color-mix(in srgb, ${(t.vars || t).palette.background.paper} 95%, #fff)`
      : (t.vars || t).palette.background.paper;

  const selectedColor = t.vars
    ? `rgb(${t.vars.palette.primary.mainChannel})`
    : t.palette.primary.main;

  const radius = getRadius(t);

  const fontBody = t.vars
    ? ((t.vars as any)?.font?.body2 ?? formatFont(t.typography.body2))
    : formatFont(t.typography.body2);
  const fontSmall = t.vars
    ? ((t.vars as any)?.font?.caption ?? formatFont(t.typography.caption))
    : formatFont(t.typography.caption);

  const k = vars.keys;

  return {
    [k.spacingUnit]: t.vars ? ((t.vars as any).spacing ?? t.spacing(1)) : t.spacing(1),

    [k.colors.border.base]: borderColor,
    [k.colors.background.base]: backgroundBase,
    [k.colors.background.overlay]: backgroundOverlay,
    [k.colors.background.backdrop]: backgroundBackdrop,
    [k.colors.foreground.base]: (t.vars || t).palette.text.primary,
    [k.colors.foreground.muted]: (t.vars || t).palette.text.secondary,
    [k.colors.foreground.accent]: (t.vars || t).palette.primary.dark,
    [k.colors.foreground.disabled]: (t.vars || t).palette.text.disabled,

    [k.colors.interactive.hover]: removeOpacity((t.vars || t).palette.action.hover),
    [k.colors.interactive.hoverOpacity]: (t.vars || t).palette.action.hoverOpacity,
    [k.colors.interactive.focus]: removeOpacity((t.vars || t).palette.primary.main),
    [k.colors.interactive.focusOpacity]: (t.vars || t).palette.action.focusOpacity,
    [k.colors.interactive.disabled]: removeOpacity((t.vars || t).palette.action.disabled),
    [k.colors.interactive.disabledOpacity]: (t.vars || t).palette.action.disabledOpacity,
    [k.colors.interactive.selected]: selectedColor,
    [k.colors.interactive.selectedOpacity]: (t.vars || t).palette.action.selectedOpacity,

    [k.header.background.base]: backgroundHeader,
    [k.cell.background.pinned]: backgroundPinned,

    [k.radius.base]: radius,

    [k.typography.fontFamily.base]: t.typography.fontFamily as string,
    [k.typography.fontWeight.light]: t.typography.fontWeightLight as string,
    [k.typography.fontWeight.regular]: t.typography.fontWeightRegular as string,
    [k.typography.fontWeight.medium]: t.typography.fontWeightMedium as string,
    [k.typography.fontWeight.bold]: t.typography.fontWeightBold as string,
    [k.typography.font.body]: fontBody,
    [k.typography.font.small]: fontSmall,

    [k.transitions.easing.easeIn]: t.transitions.easing.easeIn,
    [k.transitions.easing.easeOut]: t.transitions.easing.easeOut,
    [k.transitions.easing.easeInOut]: t.transitions.easing.easeInOut,
    [k.transitions.duration.short]: `${t.transitions.duration.shorter}ms`,
    [k.transitions.duration.base]: `${t.transitions.duration.short}ms`,
    [k.transitions.duration.long]: `${t.transitions.duration.standard}ms`,

    [k.shadows.base]: (t.vars || t).shadows[2],
    [k.shadows.overlay]: (t.vars || t).shadows[8],

    [k.zIndex.panel]: (t.vars || t).zIndex.modal,
    [k.zIndex.menu]: (t.vars || t).zIndex.modal,
  };
}

function getRadius(theme: Theme) {
  if (theme.vars) {
    return theme.vars.shape.borderRadius;
  }
  return typeof theme.shape.borderRadius === 'number'
    ? `${theme.shape.borderRadius}px`
    : theme.shape.borderRadius;
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

function setOpacity(color: string, opacity: number) {
  return `rgba(from ${color} r g b / ${opacity})`;
}

function removeOpacity(color: string) {
  return setOpacity(color, 1);
}

function formatFont(font: React.CSSProperties) {
  return `${font.fontWeight} ${font.fontSize} / ${font.lineHeight} ${font.fontFamily}`;
}
