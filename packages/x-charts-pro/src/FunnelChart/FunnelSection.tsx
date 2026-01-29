'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useInteractionItemProps, type SeriesId, consumeSlots } from '@mui/x-charts/internals';
import { useItemHighlighted } from '@mui/x-charts/hooks';
import clsx from 'clsx';
import { type FunnelSectionClasses, useUtilityClasses } from './funnelSectionClasses';

export interface FunnelSectionProps extends Omit<React.SVGProps<SVGPathElement>, 'ref'> {
  seriesId: SeriesId;
  dataIndex: number;
  color: string;
  classes?: Partial<FunnelSectionClasses>;
  variant?: 'filled' | 'outlined';
}

export const FunnelSectionPath = styled('path', {
  slot: 'internal',
  shouldForwardProp: undefined,
})(() => ({
  transition:
    'opacity 0.2s ease-in, fill 0.2s ease-in, fill-opacity 0.2s ease-in, filter 0.2s ease-in',
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
    const {
      seriesId,
      dataIndex,
      classes,
      color,
      onClick,
      className,
      variant = 'filled',
      ...other
    } = props;
    const interactionProps = useInteractionItemProps({ type: 'funnel', seriesId, dataIndex });
    const { isFaded, isHighlighted } = useItemHighlighted({ type: 'funnel', seriesId, dataIndex });

    const isOutlined = variant === 'outlined';

    return (
      <FunnelSectionPath
        {...interactionProps}
        filter={isHighlighted && !isOutlined ? 'brightness(120%)' : undefined}
        opacity={isFaded && !isOutlined ? 0.3 : 1}
        fill={color}
        stroke={isOutlined ? color : 'none'}
        fillOpacity={isOutlined && !isHighlighted ? 0.4 : 1}
        strokeOpacity={1}
        strokeWidth={isOutlined ? 1.5 : 0}
        cursor={onClick ? 'pointer' : 'unset'}
        onClick={onClick}
        data-highlighted={isHighlighted || undefined}
        data-faded={isFaded || undefined}
        className={clsx(
          classes?.root,
          isHighlighted && classes?.highlighted,
          isFaded && classes?.faded,
          isOutlined && classes?.outlined,
          !isOutlined && classes?.filled,
          className,
        )}
        {...other}
        ref={ref}
      />
    );
  }),
);

export { FunnelSection };
