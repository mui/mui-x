'use client';
import { geoGraticule10 } from '@mui/x-charts-vendor/d3-geo';
import { useGeoData } from '../hooks/useGeoData';
import { useGeoPath } from '../hooks/useGeoPath';

export function Graticule(props: Omit<React.SVGProps<SVGPathElement>, 'd'>) {
  const geoData = useGeoData();
  const path = useGeoPath();

  if (!geoData || !path) {
    return null;
  }

  const d = path(geoGraticule10());

  if (!d) {
    return null;
  }
  return <path d={d} fill="none" stroke="black" strokeWidth={0.5} {...props} />;
}
