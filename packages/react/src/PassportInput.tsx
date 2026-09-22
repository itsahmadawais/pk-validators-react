import React, { forwardRef, useId } from 'react';
import { usePassport } from './hooks/usePassport';

const MESSAGES = {
  en: { invalid: 'Invalid passport number', hint: 'Format: AB1234567' },
  ur: { invalid: 'غلط پاسپورٹ نمبر', hint: 'فارمیٹ: AB1234567' },
};

export interface PassportInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Current field value — letters are auto-uppercased. */
  value: string;
  /** Called on every keystroke with the raw input string (not yet reformatted). */
  onChange: (value: string) => void;
  /** Switches hint/error text to Urdu and sets `dir="rtl"` on the input. @default 'en' */
  locale?: 'en' | 'ur';
  /** Shows the "Format: AB1234567" hint below the input while there's no error. @default true */
  showHint?: boolean;
}

/**
 * Controlled Pakistani passport number input (`[A-Z]{2}[0-9]{7}`,
 * e.g. `AB1234567`), auto-uppercased as the user types. Unlike CNIC, this
 * format rejects implausible partial input immediately — e.g. a 3rd letter
 * can never become valid, so it errors before 9 characters are typed. All
 * standard `<input>` props (except `value`/`onChange`) are forwarded.
 *
 * Note: this format is community-sourced, not confirmed against an
 * authoritative DGIP/NADRA reference — reconfirm before relying on it for
 * anything compliance-sensitive.
 */
export const PassportInput = forwardRef<HTMLInputElement, PassportInputProps>(
  ({ value, onChange, locale = 'en', showHint = true, ...rest }, ref) => {
    const passport = usePassport(value);
    const errorId = useId();
    const hintId = useId();
    const msgs = MESSAGES[locale];

    // keep the hook's internal state in sync with a controlled `value` prop
    React.useEffect(() => {
      if (value !== passport.rawValue) passport.onChange(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      passport.onChange(e);
      onChange(e.target.value);
    };

    const showError = !passport.isValid && passport.isComplete && passport.rawValue.length > 0;

    return (
      <div>
        <input
          ref={ref}
          type="text"
          autoCapitalize="characters"
          placeholder="AB1234567"
          maxLength={9}
          value={passport.value}
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
        {!showError && showHint && (
          <span id={hintId} style={{ color: '#666', fontSize: '0.85em' }}>
            {msgs.hint}
          </span>
        )}
      </div>
    );
  }
);

PassportInput.displayName = 'PassportInput';
