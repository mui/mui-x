'use client';
import { styled } from '@mui/material/styles';

export const SectionFieldset = styled('fieldset', {
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

export const SectionHeaderTitle = styled('legend', {
  name: 'MuiEventDialog',
  slot: 'SectionHeaderTitle',
})(({ theme }) => ({
  ...theme.typography.subtitle2,
  padding: 0,
  marginBlockEnd: theme.spacing(2),
  textTransform: 'uppercase',
  color: (theme.vars || theme).palette.text.secondary,
}));
