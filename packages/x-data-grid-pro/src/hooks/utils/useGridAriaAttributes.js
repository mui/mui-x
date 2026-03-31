import { useGridAriaAttributes as useGridAriaAttributesCommunity } from '@mui/x-data-grid/internals';
import { useGridRootProps } from './useGridRootProps';
export const useGridAriaAttributesPro = () => {
    const ariaAttributesCommunity = useGridAriaAttributesCommunity();
    const rootProps = useGridRootProps();
    const ariaAttributesPro = rootProps.treeData ? { role: 'treegrid' } : {};
    return {
        ...ariaAttributesCommunity,
        ...ariaAttributesPro,
    };
};
