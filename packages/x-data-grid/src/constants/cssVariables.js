"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.vars = void 0;
// NOTE: Breakpoints can't come from the theme because we need access to them at
// initialization time and media-queries can't use CSS variables. For users with
// custom breakpoints, we might want to provide a way to configure them globally
// instead of through the theme.
var breakpoints = {
    values: {
        xs: 0, // phone
        sm: 600, // tablet
        md: 900, // small laptop
        lg: 1200, // desktop
        xl: 1536, // large screen
    },
    up: function (key) {
        var values = breakpoints.values;
        var value = typeof values[key] === 'number' ? values[key] : key;
        return "@media (min-width:".concat(value, "px)");
    },
};
var keys = {
    spacingUnit: '--DataGrid-t-spacing-unit',
    /* Variables */
    colors: {
        border: {
            base: '--DataGrid-t-color-border-base',
        },
        foreground: {
            base: '--DataGrid-t-color-foreground-base',
            muted: '--DataGrid-t-color-foreground-muted',
            accent: '--DataGrid-t-color-foreground-accent',
            disabled: '--DataGrid-t-color-foreground-disabled',
            error: '--DataGrid-t-color-foreground-error',
        },
        background: {
            base: '--DataGrid-t-color-background-base',
            overlay: '--DataGrid-t-color-background-overlay',
            backdrop: '--DataGrid-t-color-background-backdrop',
        },
        interactive: {
            hover: '--DataGrid-t-color-interactive-hover',
            hoverOpacity: '--DataGrid-t-color-interactive-hover-opacity',
            focus: '--DataGrid-t-color-interactive-focus',
            focusOpacity: '--DataGrid-t-color-interactive-focus-opacity',
            disabled: '--DataGrid-t-color-interactive-disabled',
            disabledOpacity: '--DataGrid-t-color-interactive-disabled-opacity',
            selected: '--DataGrid-t-color-interactive-selected',
            selectedOpacity: '--DataGrid-t-color-interactive-selected-opacity',
        },
    },
    header: {
        background: {
            base: '--DataGrid-t-header-background-base',
        },
    },
    cell: {
        background: {
            pinned: '--DataGrid-t-cell-background-pinned',
        },
    },
    radius: {
        base: '--DataGrid-t-radius-base',
    },
    typography: {
        font: {
            body: '--DataGrid-t-typography-font-body',
            small: '--DataGrid-t-typography-font-small',
            large: '--DataGrid-t-typography-font-large',
        },
        fontFamily: {
            base: '--DataGrid-t-typography-font-family-base',
        },
        fontWeight: {
            light: '--DataGrid-t-typography-font-weight-light',
            regular: '--DataGrid-t-typography-font-weight-regular',
            medium: '--DataGrid-t-typography-font-weight-medium',
            bold: '--DataGrid-t-typography-font-weight-bold',
        },
    },
    transitions: {
        easing: {
            easeIn: '--DataGrid-t-transition-easing-ease-in',
            easeOut: '--DataGrid-t-transition-easing-ease-out',
            easeInOut: '--DataGrid-t-transition-easing-ease-in-out',
        },
        duration: {
            short: '--DataGrid-t-transition-duration-short',
            base: '--DataGrid-t-transition-duration-base',
            long: '--DataGrid-t-transition-duration-long',
        },
    },
    shadows: {
        base: '--DataGrid-t-shadow-base',
        overlay: '--DataGrid-t-shadow-overlay',
    },
    zIndex: {
        panel: '--DataGrid-t-z-index-panel',
        menu: '--DataGrid-t-z-index-menu',
    },
};
var values = wrap(keys);
exports.vars = __assign({ breakpoints: breakpoints, spacing: spacing, transition: transition, keys: keys }, values);
function spacing(a, b, c, d) {
    /* eslint-disable prefer-template */
    if (a === undefined) {
        return spacingString(1);
    }
    if (b === undefined) {
        return spacingString(a);
    }
    if (c === undefined) {
        return spacingString(a) + ' ' + spacingString(b);
    }
    if (d === undefined) {
        return spacingString(a) + ' ' + spacingString(b) + ' ' + spacingString(c);
    }
    return (spacingString(a) + ' ' + spacingString(b) + ' ' + spacingString(c) + ' ' + spacingString(d));
    /* eslint-enable prefer-template */
}
function spacingString(value) {
    if (value === 0) {
        return '0';
    }
    return "calc(var(--DataGrid-t-spacing-unit) * ".concat(value, ")");
}
function transition(props, options) {
    var _a = options !== null && options !== void 0 ? options : {}, _b = _a.duration, duration = _b === void 0 ? exports.vars.transitions.duration.base : _b, _c = _a.easing, easing = _c === void 0 ? exports.vars.transitions.easing.easeInOut : _c, _d = _a.delay, delay = _d === void 0 ? 0 : _d;
    return props.map(function (prop) { return "".concat(prop, " ").concat(duration, " ").concat(easing, " ").concat(delay, "ms"); }).join(', ');
}
function wrap(input) {
    if (typeof input === 'string') {
        return "var(".concat(input, ")");
    }
    var result = {};
    for (var key in input) {
        if (Object.hasOwn(input, key)) {
            result[key] = wrap(input[key]);
        }
    }
    return result;
}
