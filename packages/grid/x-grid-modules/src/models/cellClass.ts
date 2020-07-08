import { CellParams } from './params/cellParams';

export type CellClassParams = CellParams;
export type CellClassFn = (params: CellClassParams) => string | string[];
export type CellClassPropType = string | string[] | CellClassFn;
export type CellClassRules = { [cssClass: string]: (params: CellClassParams) => boolean };
