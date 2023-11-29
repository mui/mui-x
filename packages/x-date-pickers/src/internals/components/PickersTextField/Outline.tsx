import * as React from 'react';
import { styled } from '@mui/material/styles';

const OutlineRoot = styled('fieldset')({
  textAlign: 'left',
  position: 'absolute',
  bottom: 0,
  right: 0,
  top: -5,
  left: 0,
  margin: 0,
  padding: '0 8px',
  pointerEvents: 'none',
  borderRadius: 'inherit',
  borderStyle: 'solid',
  borderWidth: 1,
  overflow: 'hidden',
  minWidth: '0%',
});

const OutlineLegend = styled('legend')<{ ownerState: any }>(({ ownerState, theme }) => ({
  float: 'unset', // Fix conflict with bootstrap
  width: 'auto', // Fix conflict with bootstrap
  overflow: 'hidden', // Fix Horizontal scroll when label too long
  ...(!ownerState.withLabel && {
    padding: 0,
    lineHeight: '11px', // sync with `height` in `legend` styles
    transition: theme.transitions.create('width', {
      duration: 150,
      easing: theme.transitions.easing.easeOut,
    }),
  }),
  ...(ownerState.withLabel && {
    display: 'block', // Fix conflict with normalize.css and sanitize.css
    padding: 0,
    height: 11, // sync with `lineHeight` in `legend` styles
    fontSize: '0.75em',
    visibility: 'hidden',
    maxWidth: 0.01,
    transition: theme.transitions.create('max-width', {
      duration: 50,
      easing: theme.transitions.easing.easeOut,
    }),
    whiteSpace: 'nowrap',
    '& > span': {
      paddingLeft: 5,
      paddingRight: 5,
      display: 'inline-block',
      opacity: 0,
      visibility: 'visible',
    },
    ...(ownerState.notched && {
      maxWidth: '100%',
      transition: theme.transitions.create('max-width', {
        duration: 100,
        easing: theme.transitions.easing.easeOut,
        delay: 50,
      }),
    }),
  }),
}));

export default function Outline(props) {
  const { children, classes, className, label, notched, ...other } = props;
  const withLabel = label != null && label !== '';
  const ownerState = {
    ...props,
    notched,
    withLabel,
  };
  return (
    <OutlineRoot aria-hidden className={className} ownerState={ownerState} {...other}>
      <OutlineLegend ownerState={ownerState}>
        {/* Use the nominal use case of the legend, avoid rendering artefacts. */}
        {withLabel ? (
          <span>{label}</span>
        ) : (
          // notranslate needed while Google Translate will not fix zero-width space issue
          <span className="notranslate">&#8203;</span>
        )}
      </OutlineLegend>
    </OutlineRoot>
  );
}
