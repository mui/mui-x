'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useInteractionItemProps, SeriesId, consumeSlots } from '@mui/x-charts/internals';
import { useItemHighlighted } from '@mui/x-charts/hooks';
import clsx from 'clsx';
import { FunnelSectionClasses, useUtilityClasses } from './funnelSectionClasses';

export interface FunnelSectionProps extends Omit<React.SVGProps<SVGPathElement>, 'ref' | 'id'> {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  classes?: Partial<FunnelSectionClasses>;
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
  React.forwardRef(function FunnelSection(
    props: FunnelSectionProps,
    ref: React.Ref<SVGPathElement>,
  ) {
    const { seriesId, dataIndex, classes, color, onClick, className, ...other } = props;
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
        onClick={onClick}
        className={clsx(
          classes?.root,
          isHighlighted && classes?.highlighted,
          isFaded && classes?.faded,
          className,
        )}
        {...other}
        ref={ref}
      />
    );
  }),
);

export { FunnelSection };
