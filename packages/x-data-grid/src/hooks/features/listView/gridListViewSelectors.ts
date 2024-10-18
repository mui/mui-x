import {createSelectorV8 } from '../../../utils/createSelector';
import { GridStateCommunity } from '../../../models/gridStateCommunity';
import { gridVisibleColumnDefinitionsSelector } from '../columns';

/**
 * Get a list column definition
 */
export const gridListColumnSelector = (state: GridStateCommunity) => state.listViewColumn;


// TODO v8: Rename this function to `createSelector`
export const gridListViewVisibleColumnSelector = createSelectorV8( gridVisibleColumnDefinitionsSelector,gridListColumnSelector,(visibleColumn,listViewColumn,listView)=>{

    if(listView){
        return [listViewColumn]
    }
    
        return visibleColumn
    
})
