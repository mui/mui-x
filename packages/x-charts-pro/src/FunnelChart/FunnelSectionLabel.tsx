'use client';
import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import { consumeSlots, type SeriesId } from '@mui/x-charts/internals';
import clsx from 'clsx';
import { type FunnelSectionClasses, useLabelUtilityClasses as useDeprecatedLabelUtilityClasses } from './funnelSectionClasses';
import { useUtilityClasses } from './funnelClasses';

export interface FunnelSectionLabelConfig {
  x: number;
  y: number;
  value: string | null;
  textAnchor?: React.SVGProps<SVGTextElement>['textAnchor'];
  dominantBaseline?: React.SVGProps<SVGTextElement>['dominantBaseline'];
}

export interface FunnelSectionLabelProps extends Omit<
  React.SVGProps<SVGTextElement>,
  'ref' | 'id'
> {
  classes?: Partial<FunnelSectionClasses>;
  label: FunnelSectionLabelConfig;
  seriesId: SeriesId;
  dataIndex: number;
}

/**
 * @ignore - internal component.
 */
const FunnelSectionLabel = consumeSlots(
  'MuiFunnelSectionLabel',
  'funnelSectionLabel',
  {
    classesResolver: useDeprecatedLabelUtilityClasses,
  },
  React.forwardRef(function FunnelSectionLabel(
    props: FunnelSectionLabelProps,
    ref: React.Ref<SVGTextElement>,
  ) {
    const { classes, color, onClick, className, label, seriesId, dataIndex, ...other } = props;
    const theme = useTheme();

    const newClasses = useUtilityClasses();

    return (
      <text
        stroke="none"
        pointerEvents="none"
        fontFamily={theme.typography.body2.fontFamily}
        fontSize={theme.typography.body2.fontSize}
        fontSizeAdjust={theme.typography.body2.fontSizeAdjust}
        fontWeight={theme.typography.body2.fontWeight}
        letterSpacing={theme.typography.body2.letterSpacing}
        fontStretch={theme.typography.body2.fontStretch}
        fontStyle={theme.typography.body2.fontStyle}
        fontVariant={theme.typography.body2.fontVariant}
        fill={(theme.vars || theme)?.palette?.text?.primary}
        className={clsx(newClasses.sectionLabel, classes?.label)}
        x={label.x}
        y={label.y}
        textAnchor={label.textAnchor ?? 'middle'}
        dominantBaseline={label.dominantBaseline ?? 'central'}
        {...other}
        ref={ref}
      >
        {label.value}
      </text>
    );
  }),
);

export { FunnelSectionLabel };
