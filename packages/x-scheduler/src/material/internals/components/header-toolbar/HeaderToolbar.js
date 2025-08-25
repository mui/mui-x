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
exports.HeaderToolbar = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var store_1 = require("@base-ui-components/utils/store");
var view_switcher_1 = require("./view-switcher");
var TranslationsContext_1 = require("../../utils/TranslationsContext");
var useEventCalendarContext_1 = require("../../hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../../../primitives/use-event-calendar");
var settings_menu_1 = require("./settings-menu");
require("./HeaderToolbar.css");
exports.HeaderToolbar = React.forwardRef(function HeaderToolbar(props, forwardedRef) {
    var className = props.className, other = __rest(props, ["className"]);
    var _a = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _a.store, instance = _a.instance;
    var translations = (0, TranslationsContext_1.useTranslations)();
    var views = (0, store_1.useStore)(store, use_event_calendar_1.selectors.views);
    var showViewSwitcher = views.length > 1;
    return (<header ref={forwardedRef} className={(0, clsx_1.default)('HeaderToolbarContainer', !showViewSwitcher && 'SinglePrimaryAction', className)} {...other}>
      <div className="PrimaryActionWrapper">
        {showViewSwitcher && <view_switcher_1.ViewSwitcher />}
        <button className="HeaderToolbarButton" onClick={instance.goToToday} type="button">
          {translations.today}
        </button>
      </div>
      <settings_menu_1.SettingsMenu />
    </header>);
});
