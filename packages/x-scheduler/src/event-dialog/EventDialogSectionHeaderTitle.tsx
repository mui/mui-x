'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { styled } from '@mui/material/styles';
import { useEventEditingStyledContext } from '../internals/components/event-editing/EventEditingStyledContext';

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
 * Section title of the event dialog form, rendered as the fieldset's legend.
 */
const EventDialogSectionHeaderTitle = React.forwardRef<
  HTMLLegendElement,
  // No `as`: the wrapper is semantically a legend and its ref is typed to match.
  Omit<React.ComponentPropsWithoutRef<typeof SectionHeaderTitleRoot>, 'as'>
>(function EventDialogSectionHeaderTitle(props, forwardedRef) {
  const { classes } = useEventEditingStyledContext();
  return (
    <SectionHeaderTitleRoot
      {...props}
      ref={forwardedRef}
      className={clsx(classes.eventDialogSectionHeaderTitle, props.className)}
    />
  );
});

EventDialogSectionHeaderTitle.propTypes /* remove-proptypes */ = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool])),
    PropTypes.func,
    PropTypes.object,
  ]),
} as any;

export { EventDialogSectionHeaderTitle };
