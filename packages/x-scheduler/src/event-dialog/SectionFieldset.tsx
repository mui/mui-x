'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useEventEditingStyledContext } from '../internals/components/event-editing/EventEditingStyledContext';

const SectionFieldsetRoot = styled('fieldset', {
  name: 'MuiEventDialog',
  slot: 'SectionFieldset',
})(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  gap: theme.spacing(2),
  border: 0,
  margin: 0,
  padding: 0,
  minInlineSize: 'min-content',
}));

const SectionHeaderTitleRoot = styled('legend', {
  name: 'MuiEventDialog',
  slot: 'SectionHeaderTitle',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  padding: 0,
  marginBlockEnd: theme.spacing(2),
  textTransform: 'uppercase',
  color: (theme.vars || theme).palette.text.secondary,
}));

/**
 * Layout wrapper for one section of the event dialog form.
 * Applies the section spacing and the theme classes, so custom sections look native.
 */
function SectionFieldset(props: React.ComponentProps<typeof SectionFieldsetRoot>) {
  const { classes } = useEventEditingStyledContext();
  return (
    <SectionFieldsetRoot
      {...props}
      className={clsx(classes.eventDialogSectionFieldset, props.className)}
    />
  );
}

SectionFieldset.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { SectionFieldset };

/**
 * Section title of the event dialog form, rendered as the fieldset's legend.
 */
function SectionHeaderTitle(props: React.ComponentProps<typeof SectionHeaderTitleRoot>) {
  const { classes } = useEventEditingStyledContext();
  return (
    <SectionHeaderTitleRoot
      {...props}
      className={clsx(classes.eventDialogSectionHeaderTitle, props.className)}
    />
  );
}

SectionHeaderTitle.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  as: PropTypes.elementType,
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { SectionHeaderTitle };
