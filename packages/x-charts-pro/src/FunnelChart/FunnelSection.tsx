'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useInteractionItemProps, SeriesId, consumeSlots } from '@mui/x-charts/internals';
import { useItemHighlighted } from '@mui/x-charts/hooks';
import clsx from 'clsx';
import { FunnelItemIdentifier } from './funnel.types';
import { useUtilityClasses } from './funnelSectionClasses';

export interface FunnelSectionProps
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

export const FunnelSectionPath = styled('path')(() => ({
  transition: 'opacity 0.2s ease-in, fill 0.2s ease-in',
}));

/**
 * @ignore - internal component.
 */
const FunnelSection = consumeSlots(
  'MuiFunnelSection',
  'funnelSection',
  {
    classesResolver: useUtilityClasses,
  },
  function FunnelSection(props: FunnelSectionProps, ref: React.Ref<SVGPathElement>) {
    const { seriesId, dataIndex, classes, color, slots, slotProps, onClick, className, ...other } =
      props;
    const getInteractionItemProps = useInteractionItemProps();
    const { isFaded, isHighlighted } = useItemHighlighted({
      seriesId,
      dataIndex,
    });

    return (
      <FunnelSectionPath
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

export { FunnelSection };
