'use client';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Watermark, type MuiCommercialPackageName } from '@mui/x-license/internals';
import { useChartsLayerContainerRef } from '../hooks';

const releaseInfo = '__RELEASE_INFO__';

interface ChartsWatermarkProps {
  packageName: MuiCommercialPackageName;
}
export function ChartsWatermark(props: ChartsWatermarkProps) {
  const layerContainerRef = useChartsLayerContainerRef();

  if (!layerContainerRef.current) {
    return <Watermark packageName={props.packageName} releaseInfo={releaseInfo} />;
  }
  return ReactDOM.createPortal(
    <Watermark packageName={props.packageName} releaseInfo={releaseInfo} />,
    layerContainerRef.current,
  );
}
