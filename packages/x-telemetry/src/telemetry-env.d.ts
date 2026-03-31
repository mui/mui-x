export {};

declare global {
  interface MUIEnv {
    npm_package_name?: string;
    MUI_VERSION?: string;
    MUI_X_TELEMETRY_DISABLED?: string;
    NEXT_PUBLIC_MUI_X_TELEMETRY_DISABLED?: string;
    GATSBY_MUI_X_TELEMETRY_DISABLED?: string;
    REACT_APP_MUI_X_TELEMETRY_DISABLED?: string;
    PUBLIC_MUI_X_TELEMETRY_DISABLED?: string;
    MUI_X_TELEMETRY_DEBUG?: string;
    NEXT_PUBLIC_MUI_X_TELEMETRY_DEBUG?: string;
    GATSBY_MUI_X_TELEMETRY_DEBUG?: string;
    REACT_APP_MUI_X_TELEMETRY_DEBUG?: string;
    PUBLIC_MUI_X_TELEMETRY_DEBUG?: string;
  }
}
