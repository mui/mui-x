"use strict";
'use client';
Object.defineProperty(exports, "__esModule", { value: true });
exports.TailwindDemoContainer = TailwindDemoContainer;
var React = require("react");
var Box_1 = require("@mui/material/Box");
var CircularProgress_1 = require("@mui/material/CircularProgress");
/**
 * WARNING: This is an internal component used in documentation to inject the Tailwind script.
 * Please do not use it in your application.
 */
function TailwindDemoContainer(props) {
    var children = props.children, documentBody = props.documentBody;
    var _a = React.useState(false), isLoaded = _a[0], setIsLoaded = _a[1];
    React.useEffect(function () {
        var body = documentBody !== null && documentBody !== void 0 ? documentBody : document.body;
        var script = document.createElement('script');
        script.src = 'https://unpkg.com/@tailwindcss/browser@4';
        var mounted = true;
        var cleanup = function () {
            var _a;
            mounted = false;
            script.remove();
            var head = (_a = body === null || body === void 0 ? void 0 : body.ownerDocument) === null || _a === void 0 ? void 0 : _a.head;
            if (!head) {
                return;
            }
            var styles = head.querySelectorAll('style:not([data-emotion])');
            styles.forEach(function (style) {
                var _a;
                var styleText = (_a = style.textContent) === null || _a === void 0 ? void 0 : _a.substring(0, 100);
                var isTailwindStylesheet = styleText === null || styleText === void 0 ? void 0 : styleText.includes('tailwind');
                if (isTailwindStylesheet) {
                    style.remove();
                }
            });
        };
        script.onload = function () {
            if (!mounted) {
                cleanup();
                return;
            }
            setIsLoaded(true);
        };
        body.appendChild(script);
        return cleanup;
    }, [documentBody]);
    return isLoaded ? (children) : (<Box_1.default sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
      <CircularProgress_1.default />
    </Box_1.default>);
}
