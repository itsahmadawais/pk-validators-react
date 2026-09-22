import type { FieldErrors, FieldValues, Resolver } from 'react-hook-form';
import { validateCnic, validatePassport, validatePkPhone } from '@pk-validators/core';

export interface PkResolverFields {
  /** Validates a top-level `cnic` field with {@link validateCnic}. */
  cnic?: boolean;
  /** Validates a top-level `phone` field with {@link validatePkPhone}. */
  phone?: boolean;
  /** Validates a top-level `passport` field with {@link validatePassport}. */
  passport?: boolean;
}

const FIELD_VALIDATORS: Record<
  keyof PkResolverFields,
  { validate: (value: string) => boolean; message: string }
> = {
  cnic: { validate: (v) => validateCnic(v).valid, message: 'Invalid CNIC number' },
  phone: { validate: (v) => validatePkPhone(v).valid, message: 'Invalid mobile number' },
  passport: { validate: (v) => validatePassport(v).valid, message: 'Invalid passport number' },
};

/**
 * React Hook Form resolver for Pakistani fields, pre-wired so callers don't
 * need to hand-write Zod schemas for the common case. Enable only the fields
 * present on the form, e.g. `pkResolver({ cnic: true, phone: true })`.
 * Combine with your own resolver (e.g. via `zodResolver` + manual merging)
 * if the form has additional fields to validate.
 */
export function pkResolver<TFieldValues extends FieldValues = FieldValues>(
  fields: PkResolverFields
): Resolver<TFieldValues> {
  return async (values) => {
    const errors: FieldErrors<TFieldValues> = {};

    (Object.keys(fields) as Array<keyof PkResolverFields>).forEach((field) => {
      if (!fields[field]) return;
      const raw = (values as Record<string, unknown>)[field];
      const { validate, message } = FIELD_VALIDATORS[field];
      if (typeof raw !== 'string' || !validate(raw)) {
        (errors as Record<string, unknown>)[field] = { type: 'validate', message };
      }
    });

    const hasErrors = Object.keys(errors).length > 0;
    return { values: hasErrors ? {} : values, errors };
  };
}
