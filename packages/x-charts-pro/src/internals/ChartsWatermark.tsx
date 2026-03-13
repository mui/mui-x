'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Watermark, type CommercialPackageInfo } from '@mui/x-license/internals';
import { useChartsLayerContainerRef } from '../hooks';

interface ChartsWatermarkProps {
  packageInfo: CommercialPackageInfo;
}
export function ChartsWatermark(props: ChartsWatermarkProps) {
  const layerContainerRef = useChartsLayerContainerRef();

  if (!layerContainerRef.current) {
    return <Watermark packageInfo={props.packageInfo} />;
  }
  return ReactDOM.createPortal(
    <Watermark packageInfo={props.packageInfo} />,
    layerContainerRef.current,
  );
}
