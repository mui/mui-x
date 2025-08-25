"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.syncSelectionToDOM = syncSelectionToDOM;
var ownerDocument_1 = require("@mui/utils/ownerDocument");
var utils_1 = require("../../utils/utils");
function syncSelectionToDOM(parameters) {
    var focused = parameters.focused, domGetters = parameters.domGetters, _a = parameters.stateResponse, 
    // States and derived states
    parsedSelectedSections = _a.parsedSelectedSections, state = _a.state;
    if (!domGetters.isReady()) {
        return;
    }
    var selection = (0, ownerDocument_1.default)(domGetters.getRoot()).getSelection();
    if (!selection) {
        return;
    }
    if (parsedSelectedSections == null) {
        // If the selection contains an element inside the field, we reset it.
        if (selection.rangeCount > 0 &&
            domGetters.getRoot().contains(selection.getRangeAt(0).startContainer)) {
            selection.removeAllRanges();
        }
        if (focused) {
            domGetters.getRoot().blur();
        }
        return;
    }
    // On multi input range pickers we want to update selection range only for the active input
    if (!domGetters.getRoot().contains((0, utils_1.getActiveElement)(domGetters.getRoot()))) {
        return;
    }
    var range = new window.Range();
    var target;
    if (parsedSelectedSections === 'all') {
        target = domGetters.getRoot();
    }
    else {
        var section = state.sections[parsedSelectedSections];
        if (section.type === 'empty') {
            target = domGetters.getSectionContainer(parsedSelectedSections);
        }
        else {
            target = domGetters.getSectionContent(parsedSelectedSections);
        }
    }
    range.selectNodeContents(target);
    target.focus();
    selection.removeAllRanges();
    selection.addRange(range);
}
