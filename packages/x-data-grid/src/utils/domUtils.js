import { gridClasses } from '../constants/gridClasses';
export function isOverflown(element) {
    return element.scrollHeight > element.clientHeight || element.scrollWidth > element.clientWidth;
}
export function findParentElementFromClassName(elem, className) {
    return elem.closest(`.${className}`);
}
// TODO, eventually replaces this function with CSS.escape, once available in jsdom, either added manually or built in
// https://github.com/jsdom/jsdom/issues/1550#issuecomment-236734471
export function escapeOperandAttributeSelector(operand) {
    return operand.replace(/["\\]/g, '\\$&');
}
export function getGridColumnHeaderElement(root, field) {
    return root.querySelector(`[role="columnheader"][data-field="${escapeOperandAttributeSelector(field)}"]`);
}
function getGridRowElementSelector(id) {
    return `.${gridClasses.row}[data-id="${escapeOperandAttributeSelector(String(id))}"]`;
}
export function getGridRowElement(root, id) {
    return root.querySelector(getGridRowElementSelector(id));
}
export function getGridCellElement(root, { id, field }) {
    const rowSelector = getGridRowElementSelector(id);
    const cellSelector = `.${gridClasses.cell}[data-field="${escapeOperandAttributeSelector(field)}"]`;
    const selector = `${rowSelector} ${cellSelector}`;
    return root.querySelector(selector);
}
// https://www.abeautifulsite.net/posts/finding-the-active-element-in-a-shadow-root/
export const getActiveElement = (root = document) => {
    const activeEl = root.activeElement;
    if (!activeEl) {
        return null;
    }
    if (activeEl.shadowRoot) {
        return getActiveElement(activeEl.shadowRoot);
    }
    return activeEl;
};
export function isEventTargetInPortal(event) {
    if (
    // The target is not an element when triggered by a Select inside the cell
    // See https://github.com/mui/material-ui/issues/10534
    event.target.nodeType === 1 &&
        !event.currentTarget.contains(event.target)) {
        return true;
    }
    return false;
}
export function getFieldFromHeaderElem(colCellEl) {
    return colCellEl.getAttribute('data-field');
}
export function findHeaderElementFromField(elem, field) {
    return elem.querySelector(`[data-field="${escapeOperandAttributeSelector(field)}"]`);
}
export function getFieldsFromGroupHeaderElem(colCellEl) {
    return colCellEl.getAttribute('data-fields').slice(2, -2).split('-|-');
}
export function findGroupHeaderElementsFromField(elem, field) {
    return Array.from(elem.querySelectorAll(`[data-fields*="|-${escapeOperandAttributeSelector(field)}-|"]`) ?? []);
}
export function findGridCellElementsFromCol(col, api) {
    const root = findParentElementFromClassName(col, gridClasses.root);
    if (!root) {
        throw new Error('MUI X: The root element is not found.');
    }
    const ariaColIndex = col.getAttribute('aria-colindex');
    if (!ariaColIndex) {
        return [];
    }
    const colIndex = Number(ariaColIndex) - 1;
    const cells = [];
    if (!api.virtualScrollerRef?.current) {
        return [];
    }
    queryRows(api).forEach((rowElement) => {
        const rowId = rowElement.getAttribute('data-id');
        if (!rowId) {
            return;
        }
        let columnIndex = colIndex;
        const cellColSpanInfo = api.unstable_getCellColSpanInfo(rowId, colIndex);
        if (cellColSpanInfo && cellColSpanInfo.spannedByColSpan) {
            columnIndex = cellColSpanInfo.leftVisibleCellIndex;
        }
        const cell = rowElement.querySelector(`[data-colindex="${columnIndex}"]`);
        if (cell) {
            cells.push(cell);
        }
    });
    return cells;
}
export function findGridElement(api, klass) {
    return api.rootElementRef.current.querySelector(`.${gridClasses[klass]}`);
}
const findPinnedCells = ({ api, colIndex, position, filterFn, }) => {
    if (colIndex === null) {
        return [];
    }
    const cells = [];
    queryRows(api).forEach((rowElement) => {
        const rowId = rowElement.getAttribute('data-id');
        if (!rowId) {
            return;
        }
        rowElement
            .querySelectorAll(`.${gridClasses[position === 'left' ? 'cell--pinnedLeft' : 'cell--pinnedRight']}`)
            .forEach((cell) => {
            const currentColIndex = parseCellColIndex(cell);
            if (currentColIndex !== null && filterFn(currentColIndex)) {
                cells.push(cell);
            }
        });
    });
    return cells;
};
export function findLeftPinnedCellsAfterCol(api, col, isRtl) {
    const colIndex = parseCellColIndex(col);
    return findPinnedCells({
        api,
        colIndex,
        position: isRtl ? 'right' : 'left',
        filterFn: (index) => (isRtl ? index < colIndex : index > colIndex),
    });
}
export function findRightPinnedCellsBeforeCol(api, col, isRtl) {
    const colIndex = parseCellColIndex(col);
    return findPinnedCells({
        api,
        colIndex,
        position: isRtl ? 'left' : 'right',
        filterFn: (index) => (isRtl ? index > colIndex : index < colIndex),
    });
}
const findPinnedHeaders = ({ api, colIndex, position, filterFn, }) => {
    if (!api.columnHeadersContainerRef?.current) {
        return [];
    }
    if (colIndex === null) {
        return [];
    }
    const elements = [];
    api.columnHeadersContainerRef.current
        .querySelectorAll(`.${gridClasses[position === 'left' ? 'columnHeader--pinnedLeft' : 'columnHeader--pinnedRight']}`)
        .forEach((element) => {
        const currentColIndex = parseCellColIndex(element);
        if (currentColIndex !== null && filterFn(currentColIndex, element)) {
            elements.push(element);
        }
    });
    return elements;
};
export function findLeftPinnedHeadersAfterCol(api, col, isRtl) {
    const colIndex = parseCellColIndex(col);
    return findPinnedHeaders({
        api,
        position: isRtl ? 'right' : 'left',
        colIndex,
        filterFn: (index) => (isRtl ? index < colIndex : index > colIndex),
    });
}
export function findRightPinnedHeadersBeforeCol(api, col, isRtl) {
    const colIndex = parseCellColIndex(col);
    return findPinnedHeaders({
        api,
        position: isRtl ? 'left' : 'right',
        colIndex,
        filterFn: (index, element) => {
            if (element.classList.contains(gridClasses['columnHeader--last'])) {
                return false;
            }
            return isRtl ? index > colIndex : index < colIndex;
        },
    });
}
export function findGridHeader(api, field) {
    const headers = api.columnHeadersContainerRef.current;
    return headers.querySelector(`:scope > div > [data-field="${escapeOperandAttributeSelector(field)}"][role="columnheader"]`);
}
export function findGridHeaderFilter(api, field) {
    const headers = api.columnHeadersContainerRef.current;
    return headers.querySelector(`:scope > .${gridClasses.headerFilterRow} > [data-field="${escapeOperandAttributeSelector(field)}"]`);
}
export function findGridCells(api, field) {
    const container = api.virtualScrollerRef.current;
    return Array.from(container.querySelectorAll(`:scope > div > div > div > [data-field="${escapeOperandAttributeSelector(field)}"][role="gridcell"]`));
}
function queryRows(api) {
    return api.virtualScrollerRef.current.querySelectorAll(
    // Use > to ignore rows from nested Data Grids (for example in detail panel)
    `:scope > div > div > .${gridClasses.row}`);
}
function parseCellColIndex(col) {
    const ariaColIndex = col.getAttribute('aria-colindex');
    if (!ariaColIndex) {
        return null;
    }
    return Number(ariaColIndex) - 1;
}
