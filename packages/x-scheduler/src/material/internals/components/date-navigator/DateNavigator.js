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
exports.DateNavigator = void 0;
var React = require("react");
var clsx_1 = require("clsx");
var lucide_react_1 = require("lucide-react");
var store_1 = require("@base-ui-components/utils/store");
var getAdapter_1 = require("../../../../primitives/utils/adapter/getAdapter");
var TranslationsContext_1 = require("../../utils/TranslationsContext");
var useEventCalendarContext_1 = require("../../hooks/useEventCalendarContext");
var use_event_calendar_1 = require("../../../../primitives/use-event-calendar");
require("./DateNavigator.css");
var adapter = (0, getAdapter_1.getAdapter)();
exports.DateNavigator = React.forwardRef(function DateNavigator(props, forwardedRef) {
    var className = props.className, other = __rest(props, ["className"]);
    var _a = (0, useEventCalendarContext_1.useEventCalendarContext)(), store = _a.store, instance = _a.instance;
    var translations = (0, TranslationsContext_1.useTranslations)();
    var view = (0, store_1.useStore)(store, use_event_calendar_1.selectors.view);
    var visibleDate = (0, store_1.useStore)(store, use_event_calendar_1.selectors.visibleDate);
    return (<header ref={forwardedRef} role="navigation" className={(0, clsx_1.default)('DateNavigatorContainer', className)} {...other}>
      <p className="DateNavigatorLabel" aria-live="polite">
        {adapter.format(visibleDate, 'month')} {adapter.format(visibleDate, 'year')}
      </p>
      <div className="DateNavigatorButtonsContainer">
        <button className={(0, clsx_1.default)('NeutralTextButton', 'Button', 'DateNavigatorButton')} onClick={instance.goToPreviousVisibleDate} type="button" aria-label={translations.previousTimeSpan(view)}>
          <lucide_react_1.ChevronLeft size={24} strokeWidth={2}/>
        </button>
        <button className={(0, clsx_1.default)('NeutralTextButton', 'Button', 'DateNavigatorButton')} onClick={instance.goToNextVisibleDate} type="button" aria-label={translations.nextTimeSpan(view)}>
          <lucide_react_1.ChevronRight size={24} strokeWidth={2}/>
        </button>
      </div>
    </header>);
});
