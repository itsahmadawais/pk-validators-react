import React, { forwardRef, useId } from 'react';
import { usePkPhone } from './hooks/usePkPhone';

const MESSAGES = {
  en: { invalid: 'Invalid mobile number', hint: 'Format: 0300-1234567' },
  ur: { invalid: 'غلط موبائل نمبر', hint: 'فارمیٹ: 0300-1234567' },
};

export interface PhoneInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Current field value. Accepts local (03xx...) or +92/92-prefixed input, either is reformatted. */
  value: string;
  /** Called on every keystroke with the raw input string (not yet reformatted). */
  onChange: (value: string) => void;
  /** Switches hint/error text to Urdu and sets `dir="rtl"` on the input. @default 'en' */
  locale?: 'en' | 'ur';
  /** Shows the "Format: 0300-1234567" hint below the input while there's no error and no carrier shown. @default true */
  showHint?: boolean;
  /** Shows the detected carrier (e.g. "Jazz") below the input once the number is valid. @default true */
  showCarrier?: boolean;
}

/**
 * Masked, controlled Pakistani mobile number input. Formats digits into
 * `0300-1234567` as the user types, normalizes a `+92`/`92` country-code
 * prefix to the local form, and shows a best-effort carrier once valid.
 * Rejects a structurally wrong prefix (2nd digit not `3`) immediately
 * rather than waiting for 11 digits. All standard `<input>` props (except
 * `value`/`onChange`) are forwarded.
 */
export const PhoneInput = forwardRef<HTMLInputElement, PhoneInputProps>(
  ({ value, onChange, locale = 'en', showHint = true, showCarrier = true, ...rest }, ref) => {
    const phone = usePkPhone(value);
    const errorId = useId();
    const hintId = useId();
    const msgs = MESSAGES[locale];

    React.useEffect(() => {
      if (value !== phone.rawValue) phone.onChange(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      phone.onChange(e);
      onChange(e.target.value);
    };

    const showError = !phone.isValid && phone.isComplete && phone.rawValue.length > 0;

    return (
      <div>
        <input
          ref={ref}
          type="tel"
          inputMode="tel"
          placeholder="0300-1234567"
          maxLength={12}
          value={phone.value}
          onChange={handleChange}
          aria-invalid={showError}
          aria-describedby={showError ? errorId : showHint ? hintId : undefined}
          dir={locale === 'ur' ? 'rtl' : 'ltr'}
          {...rest}
        />
        {showError && (
          <span id={errorId} role="alert" style={{ color: '#c0392b', fontSize: '0.85em' }}>
            {msgs.invalid}
          </span>
        )}
        {!showError && phone.isValid && showCarrier && phone.carrier && (
          <span style={{ color: '#2e7d32', fontSize: '0.85em' }}>{phone.carrier}</span>
        )}
        {!showError && !phone.isValid && showHint && (
          <span id={hintId} style={{ color: '#666', fontSize: '0.85em' }}>
            {msgs.hint}
          </span>
        )}
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';
