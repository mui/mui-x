import generateUtilityClass from '@mui/utils/generateUtilityClass';
import generateUtilityClasses from '@mui/utils/generateUtilityClasses';
import composeClasses from '@mui/utils/composeClasses';



export interface ChartsAxisHighlightValueClasses {
    /** Styles applied to the root element. */
    root: string;
    /** Styles applied to the top axis highlight. */
    top: string;
    /** Styles applied to the bottom axis highlight. */
    bottom: string;
    /** Styles applied to the left axis highlight. */
    left: string;
    /** Styles applied to the right axis highlight. */
    right: string;
}

export type ChartsAxisHighlightValueClassKey = keyof ChartsAxisHighlightValueClasses;

export function getChartsAxisHighlightValueUtilityClass(slot: string) {
    return generateUtilityClass('MuiChartsAxisHighlightValue', slot);
}

export const useUtilityClasses = (
    ownerState: { position: 'top' | 'right' | 'bottom' | 'left' },
) => {
    const { position } = ownerState;

    const slots = {
        root: ['root', position],
    };

    return composeClasses(slots, getChartsAxisHighlightValueUtilityClass);
};
export const chartsAxisHighlightValueClasses: ChartsAxisHighlightValueClasses =
    generateUtilityClasses('MuiChartsAxisHighlightValue', [
        'root',
        'top',
        'bottom',
        'left',
        'right',
    ]);