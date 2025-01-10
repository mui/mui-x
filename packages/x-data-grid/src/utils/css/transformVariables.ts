import { alpha, darken, lighten, type Theme } from '@mui/material/styles';
import { vars } from '../../constants/cssVariables';

export function transformMaterialUITheme(t: Theme) {
  const borderColor = getBorderColor(t);

  const backgroundBase =
    t.mixins.MuiDataGrid?.containerBackground ?? (t.vars || t).palette.background.default;
  const backgroundPinned = t.mixins.MuiDataGrid?.pinnedBackground ?? backgroundBase;
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
    [k.colors.background.base]: backgroundBase,
    [k.colors.background.overlay]: t.palette.background.paper,
    [k.colors.background.backdrop]: backgroundBackdrop,
    [k.colors.foreground.base]: t.palette.text.primary,
    [k.colors.foreground.muted]: t.palette.text.secondary,
    [k.colors.foreground.accent]: t.palette.primary.dark,
    [k.colors.foreground.disabled]: t.palette.text.disabled,

    [k.colors.interactive.hover]: removeOpacity(t.palette.action.hover),
    [k.colors.interactive.hoverOpacity]: t.palette.action.hoverOpacity,
    [k.colors.interactive.focus]: removeOpacity(t.palette.primary.main),
    [k.colors.interactive.focusOpacity]: t.palette.action.focusOpacity,
    [k.colors.interactive.disabled]: removeOpacity(t.palette.action.disabled),
    [k.colors.interactive.disabledOpacity]: t.palette.action.disabledOpacity,
    [k.colors.interactive.selected]: selectedColor,
    [k.colors.interactive.selectedOpacity]: t.palette.action.selectedOpacity,

    [k.cell.background.pinned]: backgroundPinned,

    [k.radius.base]:
      typeof t.shape.borderRadius === 'number' ? `${t.shape.borderRadius}px` : t.shape.borderRadius,

    [k.typography.fontFamily.base]: t.typography.fontFamily,
    [k.typography.fontWeight.light]: t.typography.fontWeightLight,
    [k.typography.fontWeight.regular]: t.typography.fontWeightRegular,
    [k.typography.fontWeight.medium]: t.typography.fontWeightMedium,
    [k.typography.fontWeight.bold]: t.typography.fontWeightBold,
    [k.typography.body.fontFamily]: t.typography.body2.fontFamily,
    [k.typography.body.fontSize]: t.typography.body2.fontSize,
    [k.typography.body.fontWeight]: t.typography.body2.fontWeight,
    [k.typography.body.letterSpacing]: t.typography.body2.letterSpacing,
    [k.typography.body.lineHeight]: t.typography.body2.lineHeight,
    [k.typography.small.fontFamily]: t.typography.caption.fontFamily,
    [k.typography.small.fontSize]: t.typography.caption.fontSize,
    [k.typography.small.fontWeight]: t.typography.caption.fontWeight,
    [k.typography.small.letterSpacing]: t.typography.caption.letterSpacing,
    [k.typography.small.lineHeight]: t.typography.caption.lineHeight,

    [k.transitions.easing.easeIn]: t.transitions.easing.easeIn,
    [k.transitions.easing.easeOut]: t.transitions.easing.easeOut,
    [k.transitions.easing.easeInOut]: t.transitions.easing.easeInOut,
    [k.transitions.duration.short]: `${t.transitions.duration.shorter}ms`,
    [k.transitions.duration.base]: `${t.transitions.duration.short}ms`,
    [k.transitions.duration.long]: `${t.transitions.duration.standard}ms`,

    [k.shadows.base]: t.shadows[2],

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

function setOpacity(color: string, opacity: number) {
  return `rgba(from ${color} r g b / ${opacity})`;
}

function removeOpacity(color: string) {
  return setOpacity(color, 1);
}
