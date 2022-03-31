import * as React from 'react';
import PropTypes from 'prop-types';
import { DateIOFormats } from '@date-io/core/IUtils';
import { MuiPickersAdapter } from '../internals/models';

export interface MuiPickersAdapterContextValue<TDate> {
  defaultDates: {
    minDate: TDate;
    maxDate: TDate;
  };

  utils: MuiPickersAdapter<TDate>;
}

export const MuiPickersAdapterContext =
  React.createContext<MuiPickersAdapterContextValue<unknown> | null>(null);
if (process.env.NODE_ENV !== 'production') {
  MuiPickersAdapterContext.displayName = 'MuiPickersAdapterContext';
}

export interface LocalizationProviderProps {
  children?: React.ReactNode;
  /** DateIO adapter class function */
  dateAdapter: new (...args: any) => MuiPickersAdapter<unknown>;
  /** Formats that are used for any child pickers */
  dateFormats?: Partial<DateIOFormats>;
  /**
   * Date library instance you are using, if it has some global overrides
   * ```jsx
   * dateLibInstance={momentTimeZone}
   * ```
   */
  dateLibInstance?: any;
  /** Locale for the date library you are using */
  locale?: string | object;
}

/**
 * @ignore - do not document.
 */
export function LocalizationProvider(props: LocalizationProviderProps) {
  const { children, dateAdapter: Utils, dateFormats, dateLibInstance, locale } = props;
  const utils = React.useMemo(
    () => new Utils({ locale, formats: dateFormats, instance: dateLibInstance }),
    [Utils, locale, dateFormats, dateLibInstance],
  );

  const defaultDates: MuiPickersAdapterContextValue<unknown>['defaultDates'] = React.useMemo(() => {
    return {
      minDate: utils.date('1900-01-01T00:00:00.000'),
      maxDate: utils.date('2099-12-31T00:00:00.000'),
    };
  }, [utils]);

  const contextValue: MuiPickersAdapterContextValue<unknown> = React.useMemo(() => {
    return { utils, defaultDates };
  }, [defaultDates, utils]);

  return (
    <MuiPickersAdapterContext.Provider value={contextValue}>
      {children}
    </MuiPickersAdapterContext.Provider>
  );
}

LocalizationProvider.propTypes = {
  // ----------------------------- Warning --------------------------------
  // | These PropTypes are generated from the TypeScript type definitions |
  // | To update them edit the TypeScript types and run "yarn proptypes"  |
  // ----------------------------------------------------------------------
  children: PropTypes.node,
  /**
   * DateIO adapter class function
   */
  dateAdapter: PropTypes.func.isRequired,
  /**
   * Formats that are used for any child pickers
   */
  dateFormats: PropTypes.any,
  /**
   * Date library instance you are using, if it has some global overrides
   * ```jsx
   * dateLibInstance={momentTimeZone}
   * ```
   */
  dateLibInstance: PropTypes.any,
  /**
   * Locale for the date library you are using
   */
  locale: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
} as any;
