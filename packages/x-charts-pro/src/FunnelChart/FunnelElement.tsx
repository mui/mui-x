'use client';
import * as React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import { useInteractionItemProps, SeriesId, consumeSlots } from '@mui/x-charts/internals';
import { useItemHighlighted } from '@mui/x-charts/hooks';
import clsx from 'clsx';
import { FunnelItemIdentifier } from './funnel.types';
import { useUtilityClasses } from './funnelElementClasses';

export interface FunnelElementProps
  extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id' | 'onClick'> {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  // TODO: fix any
  classes?: any;
  slots?: any;
  slotProps?: any;

  /**
   * Callback fired when a funnel item is clicked.
   * @param {React.MouseEvent<SVGElement, MouseEvent>} event The event source of the callback.
   * @param {FunnelItemIdentifier} funnelItemIdentifier The funnel item identifier.
   */
  onClick?: (
    event: React.MouseEvent<SVGElement, MouseEvent>,
    funnelItemIdentifier: FunnelItemIdentifier,
  ) => void;
}

export const FunnelElementPath = styled('path')(() => ({
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
}));

/**
 * @ignore - internal component.
 */
const FunnelElement = consumeSlots(
  'MuiFunnelElement',
  'funnelElement',
  {
    classesResolver: useUtilityClasses,
  },
  function FunnelElement(props: FunnelElementProps, ref: React.Ref<SVGPathElement>) {
    const { seriesId, dataIndex, classes, color, slots, slotProps, onClick, className, ...other } =
      props;
    const getInteractionItemProps = useInteractionItemProps();
    const { isFaded, isHighlighted } = useItemHighlighted({
      seriesId,
      dataIndex,
    });

    return (
      <FunnelElementPath
        {...getInteractionItemProps({ type: 'funnel', seriesId, dataIndex })}
        filter={isHighlighted ? 'brightness(120%)' : undefined}
        opacity={isFaded ? 0.3 : 1}
        fill={color}
        stroke="none"
        cursor={onClick ? 'pointer' : 'unset'}
        className={clsx(
          classes.root,
          isHighlighted && classes.highlighted,
          isFaded && classes.faded,
          className,
        )}
        {...other}
        ref={ref}
      />
    );
  },
);

FunnelElement.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "pnpm proptypes"  |
  // ----------------------------------------------------------------------
  classes: PropTypes.object,
} as any;

export { FunnelElement };
