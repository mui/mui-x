'use client';
import {
  type PieSeriesType,
  type DefaultizedPieValueType,
  type DefaultizedPieSeriesType,
  type ComputedPieRadius,
} from '@mui/x-charts';
import { getLabel } from '@mui/x-charts/internals/getLabel';
import {
  useTransformData,
  type ValueWithHighlight,
} from '@mui/x-charts/PieChart/dataTransform/useTransformData';
import * as React from 'react';

const RATIO = 180 / Math.PI;

export type PieArcLabelItemValues = Pick<
  ValueWithHighlight,
  | 'innerRadius'
  | 'outerRadius'
  | 'arcLabelRadius'
  | 'cornerRadius'
  | 'paddingAngle'
  | 'startAngle'
  | 'endAngle'
  | 'color'
  | 'isFaded'
  | 'isHighlighted'
  | 'dataIndex'
  | 'seriesId'
> & {
  formattedArcLabel?: string | null;
};

function getItemLabel(
  arcLabel: PieSeriesType['arcLabel'],
  arcLabelMinAngle: number,
  item: DefaultizedPieValueType,
) {
  if (!arcLabel) {
    return null;
  }
  const angle = (item.endAngle - item.startAngle) * RATIO;
  if (angle < arcLabelMinAngle) {
    return null;
  }

  switch (arcLabel) {
    case 'label':
      return getLabel(item.label, 'arc');
    case 'value':
      return item.value?.toString();
    case 'formattedValue':
      return item.formattedValue;
    default:
      return arcLabel({
        ...item,
        label: getLabel(item.label, 'arc'),
      });
  }
}

export interface PieArcLabelPlotProps
  extends
    Pick<
      DefaultizedPieSeriesType,
      | 'data'
      | 'faded'
      | 'highlighted'
      | 'cornerRadius'
      | 'paddingAngle'
      | 'arcLabel'
      | 'arcLabelMinAngle'
      | 'id'
    >,
    Pick<React.ComponentProps<'g'>, 'transform'>,
    ComputedPieRadius {
  /**
   * Override the arc attributes when it is faded.
   * @default { additionalRadius: -5 }
   */
  faded?: DefaultizedPieSeriesType['faded'];
  children: (item: PieArcLabelItemValues, index: number) => React.ReactNode;
}

function PieArcLabelPlot(props: PieArcLabelPlotProps) {
  const {
    arcLabel,
    arcLabelMinAngle = 0,
    arcLabelRadius,
    cornerRadius = 0,
    data,
    faded = { additionalRadius: -5 },
    highlighted,
    id,
    innerRadius,
    outerRadius,
    paddingAngle = 0,
    children,
    ...other
  } = props;

  const transformedData = useTransformData({
    innerRadius,
    outerRadius,
    arcLabelRadius,
    cornerRadius,
    paddingAngle,
    id,
    highlighted,
    faded,
    data,
  });

  if (data.length === 0) {
    return null;
  }

  return (
    <g {...other}>
      {transformedData.map((item, index) =>
        children(
          {
            seriesId: item.seriesId,
            dataIndex: item.dataIndex,
            startAngle: item.startAngle,
            endAngle: item.endAngle,
            paddingAngle: item.paddingAngle,
            innerRadius: item.innerRadius,
            outerRadius: item.outerRadius,
            arcLabelRadius: item.arcLabelRadius,
            cornerRadius: item.cornerRadius,
            color: item.color,
            isFaded: item.isFaded,
            isHighlighted: item.isHighlighted,
            formattedArcLabel: getItemLabel(arcLabel, arcLabelMinAngle, item),
          },
          index,
        ),
      )}
    </g>
  );
}

export { PieArcLabelPlot };
