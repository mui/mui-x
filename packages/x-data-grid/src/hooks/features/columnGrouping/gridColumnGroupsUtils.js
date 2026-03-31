import { isLeaf, } from '../../../models/gridColumnGrouping';
export const createGroupLookup = (columnGroupingModel) => {
    const groupLookup = {};
    for (let i = 0; i < columnGroupingModel.length; i += 1) {
        const node = columnGroupingModel[i];
        if (isLeaf(node)) {
            continue;
        }
        const { groupId, children, ...other } = node;
        if (!groupId) {
            throw new Error('MUI X Data Grid: An element of the columnGroupingModel is missing both `field` and `groupId`. ' +
                'Each column group must have a groupId to identify it. ' +
                'Add a groupId to the column group definition.');
        }
        if (process.env.NODE_ENV !== 'production' && !children) {
            console.warn(`MUI X: group groupId=${groupId} has no children.`);
        }
        const groupParam = { ...other, groupId };
        const subTreeLookup = createGroupLookup(children);
        if (subTreeLookup[groupId] !== undefined || groupLookup[groupId] !== undefined) {
            throw new Error(`MUI X Data Grid: The groupId "${groupId}" is used multiple times in the columnGroupingModel. ` +
                'Each groupId must be unique within the column grouping model. ' +
                'Use unique groupId values for each column group.');
        }
        Object.assign(groupLookup, subTreeLookup);
        groupLookup[groupId] = groupParam;
    }
    return groupLookup;
};
// This is the recurrence function that help writing `unwrapGroupingColumnModel()`
const recurrentUnwrapGroupingColumnModel = (columnGroupNode, parents, unwrappedGroupingModelToComplete) => {
    if (isLeaf(columnGroupNode)) {
        if (unwrappedGroupingModelToComplete[columnGroupNode.field] !== undefined) {
            throw new Error(`MUI X Data Grid: The field "${columnGroupNode.field}" appears multiple times in the columnGroupingModel. ` +
                `It is found in both: "${unwrappedGroupingModelToComplete[columnGroupNode.field].join(' > ')}" and "${parents.join(' > ')}". ` +
                'Each field should only appear once in the grouping model.');
        }
        unwrappedGroupingModelToComplete[columnGroupNode.field] = parents;
        return;
    }
    const { groupId, children } = columnGroupNode;
    children.forEach((child) => {
        recurrentUnwrapGroupingColumnModel(child, [...parents, groupId], unwrappedGroupingModelToComplete);
    });
};
/**
 * This is a function that provide for each column the array of its parents.
 * Parents are ordered from the root to the leaf.
 * @param columnGroupingModel The model such as provided in DataGrid props
 * @returns An object `{[field]: groupIds}` where `groupIds` is the parents of the column `field`
 */
export const unwrapGroupingColumnModel = (columnGroupingModel) => {
    if (!columnGroupingModel) {
        return {};
    }
    const unwrappedSubTree = {};
    columnGroupingModel.forEach((columnGroupNode) => {
        recurrentUnwrapGroupingColumnModel(columnGroupNode, [], unwrappedSubTree);
    });
    return unwrappedSubTree;
};
export const getColumnGroupsHeaderStructure = (orderedColumns, unwrappedGroupingModel, pinnedFields) => {
    const getParents = (field) => unwrappedGroupingModel[field] ?? [];
    const groupingHeaderStructure = [];
    const maxDepth = Math.max(0, ...orderedColumns.map((field) => getParents(field).length));
    const haveSameParents = (field1, field2, depth) => {
        const a = getParents(field1);
        const b = getParents(field2);
        for (let i = 0; i <= depth; i += 1) {
            if (a[i] !== b[i]) {
                return false;
            }
        }
        return true;
    };
    const haveDifferentContainers = (field1, field2) => {
        const left = pinnedFields?.left;
        const right = pinnedFields?.right;
        const inLeft1 = !!left?.includes(field1);
        const inLeft2 = !!left?.includes(field2);
        const inRight1 = !!right?.includes(field1);
        const inRight2 = !!right?.includes(field2);
        return inLeft1 !== inLeft2 || inRight1 !== inRight2;
    };
    for (let depth = 0; depth < maxDepth; depth += 1) {
        const depthStructure = [];
        for (let i = 0; i < orderedColumns.length; i += 1) {
            const field = orderedColumns[i];
            const groupId = getParents(field)[depth] ?? null;
            if (depthStructure.length === 0) {
                depthStructure.push({ columnFields: [field], groupId });
                continue;
            }
            const lastGroup = depthStructure[depthStructure.length - 1];
            const prevField = lastGroup.columnFields[lastGroup.columnFields.length - 1];
            if (lastGroup.groupId !== groupId ||
                !haveSameParents(prevField, field, depth) ||
                haveDifferentContainers(prevField, field)) {
                depthStructure.push({ columnFields: [field], groupId });
            }
            else {
                lastGroup.columnFields.push(field);
            }
        }
        groupingHeaderStructure.push(depthStructure);
    }
    return groupingHeaderStructure;
};
