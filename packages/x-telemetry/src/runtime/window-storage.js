"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setWindowStorageItem = setWindowStorageItem;
exports.getWindowStorageItem = getWindowStorageItem;
var prefix = '__mui_x_telemetry_';
function getStorageKey(key) {
    return prefix + btoa(key);
}
function setWindowStorageItem(type, key, value) {
    try {
        if (typeof window !== 'undefined' && window[type]) {
            window[type].setItem(getStorageKey(key), value);
            return true;
        }
    }
    catch (_) {
        // Storage is unavailable, skip it
    }
    return false;
}
function getWindowStorageItem(type, key) {
    try {
        if (typeof window !== 'undefined' && window[type]) {
            return window[type].getItem(getStorageKey(key));
        }
    }
    catch (_) {
        // Storage is unavailable, skip it
    }
    return null;
}
