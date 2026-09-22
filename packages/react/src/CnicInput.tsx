import React, { forwardRef, useId } from 'react';
import { useCnic } from './hooks/useCnic';

const MESSAGES = {
  en: { invalid: 'Invalid CNIC number', hint: 'Format: 35202-1234567-1' },
  ur: { invalid: 'غلط شناختی کارڈ نمبر', hint: 'فارمیٹ: 35202-1234567-1' },
};

export interface CnicInputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'value' | 'onChange'> {
  /** Current field value, digits or already-dashed — either is accepted and reformatted. */
  value: string;
  /** Called on every keystroke with the raw input string (not yet reformatted). */
  onChange: (value: string) => void;
  /** Switches hint/error text to Urdu and sets `dir="rtl"` on the input. @default 'en' */
  locale?: 'en' | 'ur';
  /** Shows the "Format: 35202-1234567-1" hint below the input while there's no error. @default true */
  showHint?: boolean;
}

/**
 * Masked, controlled CNIC input. Formats digits into `XXXXX-XXXXXXX-X` as
 * the user types, and only shows an error once 13 digits have been entered
 * and are structurally invalid — never on the first keystroke. All
 * standard `<input>` props (except `value`/`onChange`) are forwarded.
 *
 * Note: a complete 13-digit CNIC can never actually be *invalid* — real
 * CNICs have no checksum digit, so this only validates digit count. See
 * the Introduction page for details.
 */
export const CnicInput = forwardRef<HTMLInputElement, CnicInputProps>(
  ({ value, onChange, locale = 'en', showHint = true, ...rest }, ref) => {
    const cnic = useCnic(value);
    const errorId = useId();
    const hintId = useId();
    const msgs = MESSAGES[locale];

    // keep the hook's internal state in sync with a controlled `value` prop
    React.useEffect(() => {
      if (value !== cnic.rawValue) cnic.onChange(value);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [value]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      cnic.onChange(e);
      onChange(e.target.value);
    };

    const showError = !cnic.isValid && cnic.isComplete && cnic.rawValue.length > 0;

    return (
      <div>
        <input
          ref={ref}
          type="text"
          inputMode="numeric"
          placeholder="35202-1234567-1"
          maxLength={15}
          value={cnic.value}
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

CnicInput.displayName = 'CnicInput';
