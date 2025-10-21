import * as React from 'react';
import { useStore } from '@mui/x-internals/store';
import { selectorChartPolarCenter } from '../../internals/plugins/featurePlugins/useChartPolarAxis';
import { getSVGPoint } from '../../internals/getSVGPoint';
import { generateSvg2rotation } from '../../internals/plugins/featurePlugins/useChartPolarAxis/coordinateTransformation';
import { getAxisIndex } from '../../internals/plugins/featurePlugins/useChartPolarAxis/getAxisIndex';
import { useChartStore } from '../../internals/store/useChartStore';
import { useSvgRef } from '../../hooks/useSvgRef';
import { useRotationAxis } from '../../hooks/useAxis';

/**
 * This hook provides a function that from pointer event returns the rotation index.
 * @return {(event: { clientX: number; clientY: number }) => number | null} rotationIndexGetter Returns the rotation data index.
 */
export function useRadarRotationIndex() {
  const svgRef = useSvgRef();

  const store = useChartStore();
  const rotationAxis = useRotationAxis();

  const center = useStore(store, selectorChartPolarCenter);

  const rotationIndexGetter = React.useCallback(
    function rotationIndexGetter(event: { clientX: number; clientY: number }) {
      const element = svgRef.current;
      if (!element || !rotationAxis) {
        // Should never append
        throw new Error(
          `MUI X Charts: The ${!element ? 'SVG' : 'rotation axis'} was not found to compute radar dataIndex.`,
        );
      }

      const svgPoint = getSVGPoint(element, event);
      const rotation = generateSvg2rotation(center)(svgPoint.x, svgPoint.y);
      const rotationIndex = getAxisIndex(rotationAxis, rotation);

      return rotationIndex;
    },
    [center, rotationAxis, svgRef],
  );
  return rotationIndexGetter;
}
