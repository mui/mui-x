"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectorTreeViewId = void 0;
var selectors_1 = require("../../utils/selectors");
var selectorTreeViewIdState = function (state) { return state.id; };
/**
 * Get the id attribute of the tree view.
 * @param {TreeViewState<[UseTreeViewIdSignature]>} state The state of the tree view.
 * @returns {string} The id attribute of the tree view.
 */
exports.selectorTreeViewId = (0, selectors_1.createSelector)(selectorTreeViewIdState, function (idState) { return idState.treeId; });
