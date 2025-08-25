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
exports.SettingsMenu = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var useMergedRefs_1 = require("@base-ui-components/utils/useMergedRefs");
var store_1 = require("@base-ui-components/utils/store");
var lucide_react_1 = require("lucide-react");
var menu_1 = require("@base-ui-components/react/menu");
var useEventCallback_1 = require("@base-ui-components/utils/useEventCallback");
var TranslationsContext_1 = require("../../../utils/TranslationsContext");
var useEventCalendarContext_1 = require("../../../hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../../../../primitives/use-event-calendar");
require("./SettingsMenu.css");
exports.SettingsMenu = React.forwardRef(function SettingsMenu(props, forwardedRef) {
    var className = props.className, other = __rest(props, ["className"]);
    var containerRef = React.useRef(null);
    var handleRef = (0, useMergedRefs_1.useMergedRefs)(forwardedRef, containerRef);
    var translations = (0, TranslationsContext_1.useTranslations)();
    var _a = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _a.store, instance = _a.instance;
    var settings = (0, store_1.useStore)(store, use_event_calendar_1.selectors.settings);
    var handleHideWeekend = (0, useEventCallback_1.useEventCallback)(function (checked, event) {
        instance.setSettings({ hideWeekends: checked }, event);
    });
    return (<div ref={handleRef} className={(0, clsx_1.default)('SettingsMenuContainer', className)} {...other}>
      <menu_1.Menu.Root>
        <menu_1.Menu.Trigger aria-label={translations.settingsMenu} className={(0, clsx_1.default)('NeutralTextButton', 'Button', 'SettingsMenuButton')}>
          <lucide_react_1.Settings size={20} strokeWidth={1.5}/>
        </menu_1.Menu.Trigger>
        <menu_1.Menu.Portal container={containerRef}>
          <menu_1.Menu.Positioner className="SettingsMenuPositioner" sideOffset={4} align="end">
            <menu_1.Menu.Popup className="SettingsMenuPopup">
              <menu_1.Menu.CheckboxItem checked={settings.hideWeekends} onCheckedChange={handleHideWeekend} closeOnClick className="SettingsMenuCheckboxItem">
                <span>{translations.hideWeekends}</span>
                <menu_1.Menu.CheckboxItemIndicator className="SettingsMenuCheckboxIndicator">
                  <lucide_react_1.CheckIcon size={16} strokeWidth={1.5}/>
                </menu_1.Menu.CheckboxItemIndicator>
              </menu_1.Menu.CheckboxItem>
            </menu_1.Menu.Popup>
          </menu_1.Menu.Positioner>
        </menu_1.Menu.Portal>
      </menu_1.Menu.Root>
    </div>);
});
