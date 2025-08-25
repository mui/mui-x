"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = transformer;
var rename_legend_to_slots_legend_1 = require("../rename-legend-to-slots-legend");
var rename_responsive_chart_container_1 = require("../rename-responsive-chart-container");
var rename_label_and_tick_font_size_1 = require("../rename-label-and-tick-font-size");
var replace_legend_direction_values_1 = require("../replace-legend-direction-values");
var replace_legend_position_values_1 = require("../replace-legend-position-values");
var remove_experimental_mark_rendering_1 = require("../remove-experimental-mark-rendering");
var rename_legend_position_type_1 = require("../rename-legend-position-type");
var remove_on_axis_click_handler_1 = require("../remove-on-axis-click-handler");
var rename_unstable_use_series_1 = require("../rename-unstable-use-series");
var replace_legend_hidden_slot_prop_1 = require("../replace-legend-hidden-slot-prop");
function transformer(file, api, options) {
    file.source = (0, rename_legend_to_slots_legend_1.default)(file, api, options);
    file.source = (0, rename_responsive_chart_container_1.default)(file, api, options);
    file.source = (0, rename_label_and_tick_font_size_1.default)(file, api, options);
    file.source = (0, replace_legend_direction_values_1.default)(file, api, options);
    file.source = (0, replace_legend_position_values_1.default)(file, api, options);
    file.source = (0, remove_experimental_mark_rendering_1.default)(file, api, options);
    file.source = (0, rename_legend_position_type_1.default)(file, api, options);
    file.source = (0, remove_on_axis_click_handler_1.default)(file, api, options);
    file.source = (0, rename_unstable_use_series_1.default)(file, api, options);
    file.source = (0, replace_legend_hidden_slot_prop_1.default)(file, api, options);
    return file.source;
}
