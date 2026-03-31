import composeClasses from '@mui/utils/composeClasses';
import { getDataGridUtilityClass } from '../constants/gridClasses';
export function composeGridClasses(classes, slots) {
    return composeClasses(slots, getDataGridUtilityClass, classes);
}
