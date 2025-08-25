"use strict";
'use client';
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResourceLegend = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var lucide_react_1 = require("lucide-react");
var checkbox_1 = require("@base-ui-components/react/checkbox");
var checkbox_group_1 = require("@base-ui-components/react/checkbox-group");
var store_1 = require("@base-ui-components/utils/store");
var useEventCallback_1 = require("@base-ui-components/utils/useEventCallback");
var TranslationsContext_1 = require("../../utils/TranslationsContext");
var color_utils_1 = require("../../utils/color-utils");
var useEventCalendarContext_1 = require("../../hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../../../primitives/use-event-calendar");
require("./ResourceLegend.css");
function ResourceLegendItem(props) {
    var resource = props.resource;
    var translations = (0, TranslationsContext_1.useTranslations)();
    return (<label className="ResourceLegendItem">
      <span className={(0, clsx_1.default)('ResourceLegendColor', (0, color_utils_1.getColorClassName)({ resource: resource }))}/>
      <span className="ResourceLegendName">{resource.name}</span>
      <checkbox_1.Checkbox.Root className={(0, clsx_1.default)('NeutralTextButton', 'Button', 'ResourceLegendButton')} value={resource.id} render={function (rootProps, state) { return (<button type="button" aria-label={state.checked
                ? translations.hideEventsLabel(resource.name)
                : translations.showEventsLabel(resource.name)} {...rootProps}/>); }}>
        <checkbox_1.Checkbox.Indicator keepMounted render={function (indicatorProps, state) {
            return state.checked ? (<lucide_react_1.Eye size={16} strokeWidth={2} {...indicatorProps}/>) : (<lucide_react_1.EyeClosed size={16} strokeWidth={2} {...indicatorProps}/>);
        }}/>
      </checkbox_1.Checkbox.Root>
    </label>);
}
exports.ResourceLegend = React.forwardRef(function ResourceLegend(props, forwardedRef) {
    var className = props.className, other = __rest(props, ["className"]);
    var translations = (0, TranslationsContext_1.useTranslations)();
    var _a = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _a.store, instance = _a.instance;
    var resources = (0, store_1.useStore)(store, use_event_calendar_1.selectors.resources);
    var visibleResourcesList = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleResourcesList);
    var handleVisibleResourcesChange = (0, useEventCallback_1.useEventCallback)(function (value) {
        var valueSet = new Set(value);
        var newVisibleResourcesMap = new Map(store.state.resources
            .filter(function (resource) { return !valueSet.has(resource.id); })
            .map(function (resource) { return [resource.id, false]; }));
        instance.setVisibleResources(newVisibleResourcesMap);
    });
    if (resources.length === 0) {
        return null;
    }
    return (<checkbox_group_1.CheckboxGroup render={<section />} ref={forwardedRef} value={visibleResourcesList} onValueChange={handleVisibleResourcesChange} aria-label={translations.resourceLegendSectionLabel} className={(0, clsx_1.default)('ResourceLegendContainer', className)} {...other}>
      {resources.map(function (resource) {
            return <ResourceLegendItem key={resource.id} resource={resource}/>;
        })}
    </checkbox_group_1.CheckboxGroup>);
});
