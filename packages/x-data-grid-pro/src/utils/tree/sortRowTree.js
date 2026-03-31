import { GRID_ROOT_GROUP_ID, } from '@mui/x-data-grid';
// Single-linked list node
class Node {
    next;
    data;
    constructor(data, next) {
        this.next = next;
        this.data = data;
    }
    insertAfter(list) {
        if (!list.first || !list.last) {
            return;
        }
        const next = this.next;
        this.next = list.first;
        list.last.next = next;
    }
}
// Single-linked list container
class List {
    first;
    last;
    constructor(first, last) {
        this.first = first;
        this.last = last;
    }
    data() {
        const array = [];
        this.forEach((node) => {
            array.push(node.data);
        });
        return array;
    }
    forEach(fn) {
        let current = this.first;
        while (current !== null) {
            fn(current);
            current = current.next;
        }
    }
    static from(array) {
        if (array.length === 0) {
            return new List(null, null);
        }
        let index = 0;
        const first = new Node(array[index], null);
        let current = first;
        while (index + 1 < array.length) {
            index += 1;
            const node = new Node(array[index], null);
            current.next = node;
            current = node;
        }
        return new List(first, current);
    }
}
export const sortRowTree = (params) => {
    const { rowTree, disableChildrenSorting, sortRowList, shouldRenderGroupBelowLeaves } = params;
    const sortedGroupedByParentRows = new Map();
    const sortGroup = (node) => {
        const shouldSortGroup = !!sortRowList && (!disableChildrenSorting || node.depth === -1);
        let sortedRowIds;
        if (shouldSortGroup) {
            for (let i = 0; i < node.children.length; i += 1) {
                const childNode = rowTree[node.children[i]];
                if (childNode.type === 'group') {
                    sortGroup(childNode);
                }
            }
            sortedRowIds = sortRowList(node.children.map((childId) => rowTree[childId]));
        }
        else if (shouldRenderGroupBelowLeaves) {
            const childrenLeaves = [];
            const childrenGroups = [];
            for (let i = 0; i < node.children.length; i += 1) {
                const childId = node.children[i];
                const childNode = rowTree[childId];
                if (childNode.type === 'group') {
                    sortGroup(childNode);
                    childrenGroups.push(childId);
                }
                else if (childNode.type === 'leaf') {
                    childrenLeaves.push(childId);
                }
            }
            sortedRowIds = [...childrenLeaves, ...childrenGroups];
        }
        else {
            for (let i = 0; i < node.children.length; i += 1) {
                const childNode = rowTree[node.children[i]];
                if (childNode.type === 'group') {
                    sortGroup(childNode);
                }
            }
            sortedRowIds = [...node.children];
        }
        if (node.footerId != null) {
            sortedRowIds.push(node.footerId);
        }
        sortedGroupedByParentRows.set(node.id, sortedRowIds);
    };
    sortGroup(rowTree[GRID_ROOT_GROUP_ID]);
    const rootList = List.from(sortedGroupedByParentRows.get(GRID_ROOT_GROUP_ID));
    rootList.forEach((node) => {
        const children = sortedGroupedByParentRows.get(node.data);
        if (children?.length) {
            node.insertAfter(List.from(children));
        }
    });
    return rootList.data();
};
