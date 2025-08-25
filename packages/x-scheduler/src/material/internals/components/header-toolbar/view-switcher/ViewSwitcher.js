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
exports.ViewSwitcher = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var menu_1 = require("@base-ui-components/react/menu");
var useMergedRefs_1 = require("@base-ui-components/utils/useMergedRefs");
var store_1 = require("@base-ui-components/utils/store");
var lucide_react_1 = require("lucide-react");
var menubar_1 = require("@base-ui-components/react/menubar");
var TranslationsContext_1 = require("../../../utils/TranslationsContext");
var useEventCalendarContext_1 = require("../../../hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../../../../primitives/use-event-calendar");
require("./ViewSwitcher.css");
exports.ViewSwitcher = React.forwardRef(function ViewSwitcher(props, forwardedRef) {
    var className = props.className, other = __rest(props, ["className"]);
    var _a = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _a.store, instance = _a.instance;
    var views = (0, store_1.useStore)(store, use_event_calendar_1.selectors.views);
    var view = (0, store_1.useStore)(store, use_event_calendar_1.selectors.view);
    var containerRef = React.useRef(null);
    var handleRef = (0, useMergedRefs_1.useMergedRefs)(forwardedRef, containerRef);
    var translations = (0, TranslationsContext_1.useTranslations)();
    var handleClick = React.useCallback(function (event) {
        var newView = event.currentTarget.getAttribute('data-view');
        if (newView) {
            instance.setView(newView, event);
        }
    }, [instance]);
    var showAll = views.length <= 3;
    var visible = showAll ? views : views.slice(0, 2);
    var dropdown = showAll ? [] : views.slice(2);
    var currentOverflowView = dropdown.includes(view) ? view : null;
    var dropdownLabel = currentOverflowView
        ? translations[currentOverflowView]
        : translations.other;
    return (<div ref={handleRef} className={(0, clsx_1.default)('ViewSwitcherContainer', className)} {...other}>
      <menubar_1.Menubar className="ViewSwitcherMenuBar">
        {visible.map(function (visibleView) { return (<button key={visibleView} className="ViewSwitcherMainItem" onClick={handleClick} data-view={visibleView} type="button" data-pressed={view === visibleView || undefined} aria-pressed={view === visibleView}>
            {translations[visibleView]}
          </button>); })}
        {dropdown.length > 0 && (<menu_1.Menu.Root>
            <menu_1.Menu.Trigger className="ViewSwitcherMainItem" data-view="other" data-highlighted={dropdown.includes(view) || undefined}>
              {dropdownLabel} <lucide_react_1.ChevronDown size={16} strokeWidth={2}/>
            </menu_1.Menu.Trigger>
            <menu_1.Menu.Portal container={containerRef}>
              <menu_1.Menu.Positioner className="ViewSwitcherMenuPositioner" sideOffset={9} align="end" alignOffset={-4}>
                <menu_1.Menu.Popup className="ViewSwitcherMenuPopup">
                  <menu_1.Menu.RadioGroup value={view} onValueChange={instance.setView} className="ViewSwitcherRadioGroup">
                    {dropdown.map(function (dropdownView) { return (<menu_1.Menu.RadioItem key={dropdownView} className="ViewSwitcherRadioItem" value={dropdownView} closeOnClick>
                        {translations[dropdownView]}
                      </menu_1.Menu.RadioItem>); })}
                  </menu_1.Menu.RadioGroup>
                </menu_1.Menu.Popup>
              </menu_1.Menu.Positioner>
            </menu_1.Menu.Portal>
          </menu_1.Menu.Root>)}
      </menubar_1.Menubar>
    </div>);
});
