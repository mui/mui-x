import * as React from 'react';
import { SxProps, Theme } from '@mui/material/styles';
import { SlotComponentPropsFromProps } from '../internals/SlotComponentPropsFromProps';
import { ChartsLoadingOverlay } from './ChartsLoadingOverlay';
import { useSeries } from '../hooks/useSeries';
import { SeriesId } from '../models/seriesType/common';
import { ChartsNoDataOverlay } from './ChartsNoDataOverlay';

export function useNoData() {
  const seriesPerType = useSeries();

  return Object.values(seriesPerType).every((seriesOfGivenType) => {
    if (!seriesOfGivenType) {
      return true;
    }
    const { series, seriesOrder } = seriesOfGivenType;

    return seriesOrder.every((seriesId: SeriesId) => series[seriesId].data.length === 0);
  });
}

export type CommonOverlayProps = React.SVGAttributes<SVGTextElement> & {
  /**
   * The message displayed by the overlay.
   */
  message?: string;
  sx?: SxProps<Theme>;
};

export interface ChartsOverlaySlots {
  /**
   * Overlay component rendered when the chart is in a loading state.
   * @default ChartsLoadingOverlay
   */
  loadingOverlay?: React.ElementType<CommonOverlayProps>;
  /**
   * Overlay component rendered when the chart has no data to display.
   * @default ChartsNoDataOverlay
   */
  noDataOverlay?: React.ElementType<CommonOverlayProps>;
}
export interface ChartsOverlaySlotProps {
  loadingOverlay?: SlotComponentPropsFromProps<CommonOverlayProps, {}, {}>;
  noDataOverlay?: SlotComponentPropsFromProps<CommonOverlayProps, {}, {}>;
}

export interface ChartsOverlayProps {
  /**
   * If `true`, a loading overlay is displayed.
   * @default false
   */
  loading?: boolean;
  /**
   * Overridable component slots.
   * @default {}
   */
  slots?: ChartsOverlaySlots;
  /**
   * The props used for each component slot.
   * @default {}
   */
  slotProps?: ChartsOverlaySlotProps;
}

export function ChartsOverlay(props: ChartsOverlayProps) {
  const noData = useNoData();

  if (props.loading) {
    const LoadingOverlay = props.slots?.loadingOverlay ?? ChartsLoadingOverlay;
    return <LoadingOverlay {...props.slotProps?.loadingOverlay} />;
  }
  if (noData) {
    const NoDataOverlay = props.slots?.noDataOverlay ?? ChartsNoDataOverlay;
    return <NoDataOverlay {...props.slotProps?.noDataOverlay} />;
  }
  return null;
}
