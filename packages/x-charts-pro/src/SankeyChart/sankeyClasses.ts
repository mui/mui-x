import composeClasses from '@mui/utils/composeClasses';
import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';

export interface SankeyClasses {
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
  /** Styles applied to an individual node element. */
  node: string;
  /** Styles applied to an individual link element. */
  link: string;
  /** Styles applied to an individual node label element. */
  nodeLabel: string;
  /** Styles applied to an individual link label element. */
  linkLabel: string;
}

export type SankeyClassKey = keyof SankeyClasses;

export function getSankeyUtilityClass(slot: string) {
  return generateUtilityClass('MuiSankeyChart', slot);
}

export const sankeyClasses: SankeyClasses = generateUtilityClasses('MuiSankeyChart', [
  'root',
  'nodes',
  'nodeLabels',
  'links',
  'linkLabels',
  'node',
  'link',
  'nodeLabel',
  'linkLabel',
]);

export const useUtilityClasses = (options?: { classes?: Partial<SankeyClasses> }) => {
  const { classes } = options ?? {};

  const slots = {
    root: ['root'],
    nodes: ['nodes'],
    nodeLabels: ['nodeLabels'],
    links: ['links'],
    linkLabels: ['linkLabels'],
    node: ['node'],
    link: ['link'],
    nodeLabel: ['nodeLabel'],
    linkLabel: ['linkLabel'],
  };

  return composeClasses(slots, getSankeyUtilityClass, classes);
};
