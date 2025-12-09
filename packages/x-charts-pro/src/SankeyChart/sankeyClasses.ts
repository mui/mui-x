import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface SankeyPlotClasses {
  /** Styles applied to the root element. */
  root: string;
  /** Styles applied to the nodes container. */
  nodes: string;
  /** Styles applied to the node label container. */
  nodeLabels: string;
  /** Styles applied to the links container. */
  links: string;
  /** Styles applied to the link label container. */
  linkLabels: string;
}

export function getSankeyPlotUtilityClass(slot: string) {
  return generateUtilityClass('MuiSankeyChart', slot);
}

export const sankeyPlotClasses: SankeyPlotClasses = generateUtilityClasses('MuiSankeyChart', [
  'root',
  'nodes',
  'nodeLabels',
  'links',
  'linkLabels',
]);

export const useUtilityClasses = (ownerState: { classes?: Partial<SankeyPlotClasses> }) => {
  const { classes } = ownerState;

  const slots = {
    root: ['root'],
    nodes: ['nodes'],
    nodeLabels: ['nodeLabels'],
    links: ['links'],
    linkLabels: ['linkLabels'],
  };

  return composeClasses(slots, getSankeyPlotUtilityClass, classes);
};
