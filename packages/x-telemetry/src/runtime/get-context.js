import telemetryContext from '../context';
import { hashString } from './hash-string';
import { getWindowStorageItem, setWindowStorageItem } from './window-storage';
function generateId(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let counter = 0;
    while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
    }
    return result;
}
function pick(obj, keys) {
    return keys.reduce((acc, key) => {
        acc[key] = obj[key];
        return acc;
    }, {});
}
const getBrowserFingerprint = typeof window === 'undefined' || process.env.NODE_ENV === 'test'
    ? () => undefined
    : async () => {
        const fingerprintLCKey = 'fingerprint';
        try {
            const existingFingerprint = getWindowStorageItem('localStorage', fingerprintLCKey);
            if (existingFingerprint) {
                return JSON.parse(existingFingerprint);
            }
            const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
            const fp = await FingerprintJS.load({ monitoring: false });
            const fpResult = await fp.get();
            const components = { ...fpResult.components };
            delete components.cookiesEnabled;
            const fullHash = FingerprintJS.hashComponents(components);
            const coreHash = FingerprintJS.hashComponents({
                ...pick(components, [
                    'fonts',
                    'audio',
                    'languages',
                    'deviceMemory',
                    'timezone',
                    'sessionStorage',
                    'localStorage',
                    'indexedDB',
                    'openDatabase',
                    'platform',
                    'canvas',
                    'vendor',
                    'vendorFlavors',
                    'colorGamut',
                    'forcedColors',
                    'monochrome',
                    'contrast',
                    'reducedMotion',
                    'math',
                    'videoCard',
                    'architecture',
                ]),
            });
            const result = { fullHash, coreHash };
            setWindowStorageItem('localStorage', fingerprintLCKey, JSON.stringify(result));
            return result;
        }
        catch (_) {
            return null;
        }
    };
function getAnonymousId() {
    const localStorageKey = 'anonymous_id';
    const existingAnonymousId = getWindowStorageItem('localStorage', localStorageKey);
    if (existingAnonymousId) {
        return existingAnonymousId;
    }
    const generated = `anid_${generateId(32)}`;
    if (setWindowStorageItem('localStorage', localStorageKey, generated)) {
        return generated;
    }
    return '';
}
function getSessionId() {
    const localStorageKey = 'session_id';
    const existingSessionId = getWindowStorageItem('sessionStorage', localStorageKey);
    if (existingSessionId) {
        return existingSessionId;
    }
    const generated = `sesid_${generateId(32)}`;
    if (setWindowStorageItem('sessionStorage', localStorageKey, generated)) {
        return generated;
    }
    return `sestp_${generateId(32)}`;
}
async function getRuntimeProjectId() {
    // npm/pnpm scripts automatically set npm_package_name
    if (typeof process !== 'undefined' && process.env?.npm_package_name) {
        return hashString(process.env.npm_package_name);
    }
    // Dev servers often serve package.json from project root
    // (works with Vite, webpack-dev-server, and most static dev setups)
    if (typeof window !== 'undefined') {
        try {
            const res = await fetch('/package.json');
            if (res.ok) {
                const pkg = await res.json();
                if (pkg.name && typeof pkg.name === 'string') {
                    return hashString(pkg.name);
                }
            }
        }
        catch (_) {
            // Not served by this dev server, skip
        }
    }
    return null;
}
async function getTelemetryContext() {
    telemetryContext.traits.sessionId = getSessionId();
    // Initialize the context if it hasn't been initialized yet
    // (e.g. postinstall not run)
    if (!telemetryContext.config.isInitialized) {
        telemetryContext.traits.anonymousId = getAnonymousId();
        telemetryContext.config.isInitialized = true;
    }
    if (!telemetryContext.traits.projectId && !telemetryContext.config.runtimeProjectIdResolved) {
        telemetryContext.config.runtimeProjectIdResolved = true;
        telemetryContext.traits.projectId = await getRuntimeProjectId();
    }
    if (!telemetryContext.traits.fingerprint) {
        telemetryContext.traits.fingerprint = await getBrowserFingerprint();
    }
    return telemetryContext;
}
export { getRuntimeProjectId };
export default getTelemetryContext;
