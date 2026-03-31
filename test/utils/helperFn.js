import { spy } from 'sinon';
import { act, screen } from '@mui/internal-test-utils';
import { gridClasses } from '@mui/x-data-grid';
import { unwrapPrivateAPI } from '@mui/x-data-grid/internals';
export function $(a, b) {
    const target = (b === undefined ? document : a);
    const selector = (b === undefined ? a : b);
    return target.querySelector(selector);
}
export function $$(a, b) {
    const target = (b === undefined ? document : a);
    const selector = (b === undefined ? a : b);
    return Array.from(target.querySelectorAll(selector));
}
export function grid(klass) {
    return $(`.${gridClasses[klass]}`);
}
export function gridVar(name) {
    return $(`.${gridClasses.root}`).style.getPropertyValue(name);
}
export function gridOffsetTop() {
    const transform = getComputedStyle(grid('virtualScrollerRenderZone')).transform;
    return parseInt(transform.startsWith('translate3d')
        ? transform.split('(')[1].split(',')[1]
        : transform.split('(')[1].split(',')[5], 10);
}
export function sleep(duration) {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve();
        }, duration);
    });
}
export function microtasks() {
    return act(() => Promise.resolve());
}
export function spyApi(api, methodName) {
    const methodKey = methodName;
    const privateApi = unwrapPrivateAPI(api);
    const method = privateApi[methodKey];
    const spyFn = spy((...args) => {
        return spyFn.target(...args);
    });
    spyFn.spying = true;
    spyFn.target = method;
    api[methodKey] = spyFn;
    privateApi[methodKey] = spyFn;
    return spyFn;
}
export async function raf() {
    return new Promise((resolve) => {
        // Chrome and Safari have a bug where calling rAF once returns the current
        // frame instead of the next frame, so we need to call a double rAF here.
        // See crbug.com/675795 for more.
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                resolve();
            });
        });
    });
}
/**
 * Returns the 0-based row and column index of the active cell
 */
export function getActiveCell() {
    let activeElement;
    if (document.activeElement && document.activeElement.getAttribute('role') === 'gridcell') {
        activeElement = document.activeElement;
    }
    else {
        activeElement = document.activeElement && document.activeElement.closest('[role="gridcell"]');
    }
    if (!activeElement) {
        return null;
    }
    return `${activeElement.parentElement.getAttribute('data-rowindex')}-${activeElement.getAttribute('data-colindex')}`;
}
/**
 * Returns the 0-based column index of the active column header
 */
export function getActiveColumnHeader() {
    let activeElement;
    if (document.activeElement && document.activeElement.getAttribute('role') === 'columnheader') {
        activeElement = document.activeElement;
    }
    else {
        activeElement =
            document.activeElement && document.activeElement.closest('[role="columnheader"]');
    }
    if (!activeElement) {
        return null;
    }
    return `${Number(activeElement.getAttribute('aria-colindex')) - 1}`;
}
export function getColumnValues(colIndex) {
    return Array.from(document.querySelectorAll(`[role="gridcell"][data-colindex="${colIndex}"]`)).map((node) => node.textContent);
}
export function getRowValues(rowIndex) {
    return Array.from(document.querySelectorAll(`[data-rowindex="${rowIndex}"] [role="gridcell"]`)).map((node) => node.textContent);
}
export function getColumnHeaderCell(colIndex, rowIndex) {
    const headerRowSelector = rowIndex === undefined ? '' : `[role="row"][aria-rowindex="${rowIndex + 1}"] `;
    const headerCellSelector = `[role="columnheader"][aria-colindex="${colIndex + 1}"]`;
    const columnHeader = document.querySelector(`${headerRowSelector}${headerCellSelector}`);
    if (columnHeader == null) {
        throw new Error(`columnheader ${colIndex} not found`);
    }
    return columnHeader;
}
export function getColumnHeadersTextContent() {
    return screen.queryAllByRole('columnheader').map((node) => node.textContent);
}
export function getRowsFieldContent(field) {
    return Array.from(document.querySelectorAll('[role="row"][data-rowindex]')).map((node) => node.querySelector(`[role="gridcell"][data-field="${field}"]`)?.textContent);
}
export function getCell(rowIndex, colIndex) {
    const cell = document.querySelector(`[role="row"][data-rowindex="${rowIndex}"] [role="gridcell"][data-colindex="${colIndex}"]`);
    if (cell == null) {
        throw new Error(`Cell ${rowIndex} ${colIndex} not found`);
    }
    return cell;
}
export function getRows() {
    return document.querySelectorAll(`[role="row"][data-rowindex]`);
}
export function getRow(rowIndex) {
    const row = document.querySelector(`[role="row"][data-rowindex="${rowIndex}"]`);
    if (row == null) {
        throw new Error(`Row ${rowIndex} not found`);
    }
    return row;
}
/**
 * Returns the hidden `input` element of the Material UI Select component
 */
export const getSelectInput = (combobox) => {
    if (!combobox) {
        return null;
    }
    const comboboxParent = combobox.parentElement;
    if (!comboboxParent) {
        return null;
    }
    const input = comboboxParent.querySelector('input');
    return input;
};
export function getSelectByName(name) {
    return getSelectInput(screen.getByRole('combobox', { name }));
}
export const includeRowSelection = (ids) => {
    return { type: 'include', ids: new Set(ids) };
};
export const excludeRowSelection = (ids) => {
    return { type: 'exclude', ids: new Set(ids) };
};
export async function openLongTextViewPopup(cell, user, action = 'click') {
    await user.click(cell);
    const expandButton = cell.querySelector('button[aria-haspopup="dialog"]');
    if (action === 'spacebar') {
        await user.keyboard(' ');
    }
    else {
        await user.click(expandButton);
    }
}
export async function openLongTextEditPopup(cell, user, action = 'dblClick') {
    if (action === 'dblClick') {
        await user.dblClick(cell);
    }
    else {
        await user.click(cell);
        await user.keyboard('{Enter}');
    }
}
