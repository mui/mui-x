'use client';
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useFocusedItem } from '../hooks';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';
import { useGeoFeatureIndexesByName } from '../hooks/useGeoFeatureIndexesByName';
import { useMapShapeSeries } from '../hooks/useMapShapeSeries';

const FocusedMapShapeRoot = styled('path', {
  name: 'MuiMapShape',
  slot: 'Focused',
})(({ theme }) => ({
  fill: 'none',
  stroke: (theme.vars ?? theme).palette.text.primary,
  strokeWidth: 2,
  pointerEvents: 'none',
}));

/**
 * Renders an outline around the map shape currently focused through keyboard navigation.
 */
export function FocusedMapShape() {
  const focusedItem = useFocusedItem();
  const geoData = useGeoData();
  const path = useGeoPath();
  const featureIndexesByName = useGeoFeatureIndexesByName();
  const series = useMapShapeSeries();

  if (focusedItem?.type !== 'mapShape' || !geoData || !path) {
    return null;
  }

  const seriesItem = series.find((item) => item.id === focusedItem.seriesId);
  if (!seriesItem || seriesItem.hidden) {
    return null;
  }

  const dataIndex = seriesItem.lookupByName.get(focusedItem.name);
  if (dataIndex === undefined) {
    return null;
  }

  const dataItem = seriesItem.data[dataIndex];
  if (!dataItem || dataItem.hidden) {
    return null;
  }

  const featureIndexes = featureIndexesByName.get(dataItem.name);
  if (featureIndexes === undefined || featureIndexes.length === 0) {
    return null;
  }

  return (
    <g aria-hidden>
      {featureIndexes.map((featureIndex) => {
        const feature = geoData.features[featureIndex];
        const d = path(feature);
        if (!d) {
          return null;
        }
        return <FocusedMapShapeRoot key={featureIndex} d={d} />;
      })}
    </g>
  );
}
