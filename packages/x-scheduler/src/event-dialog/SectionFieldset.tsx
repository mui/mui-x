'use client';
import * as React from 'react';
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
export function SectionFieldset(props: React.ComponentProps<typeof SectionFieldsetRoot>) {
  const { classes } = useEventEditingStyledContext();
  return (
    <SectionFieldsetRoot
      {...props}
      className={clsx(classes.eventDialogSectionFieldset, props.className)}
    />
  );
}

/**
 * Section title of the event dialog form, rendered as the fieldset's legend.
 */
export function SectionHeaderTitle(props: React.ComponentProps<typeof SectionHeaderTitleRoot>) {
  const { classes } = useEventEditingStyledContext();
  return (
    <SectionHeaderTitleRoot
      {...props}
      className={clsx(classes.eventDialogSectionHeaderTitle, props.className)}
    />
  );
}
