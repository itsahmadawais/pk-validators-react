export interface PassportResult {
  valid: boolean;
  incomplete: boolean;
  formatted: string;
}

/**
 * Commonly documented current Pakistani passport format: 2 uppercase
 * letters followed by 7 digits (e.g. "AB1234567"). Reconfirm against an
 * authoritative DGIP/NADRA source before relying on this for anything
 * compliance-sensitive — passport formats have changed historically.
 */
const PASSPORT_REGEX = /^[A-Z]{2}[0-9]{7}$/;

function normalize(input: string): string {
  return (input ?? '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 9);
}

export function validatePassport(input: string): PassportResult {
  const v = normalize(input);
  const formatted = v;

  if (v.length === 0) {
    return { valid: false, incomplete: true, formatted };
  }

  if (v.length < 9) {
    // still could become valid — check what's typed so far is plausible
    const lettersPart = v.slice(0, 2);
    const digitsPart = v.slice(2);
    const lettersOk = /^[A-Z]{0,2}$/.test(lettersPart);
    const digitsOk = /^[0-9]{0,7}$/.test(digitsPart);
    return { valid: false, incomplete: lettersOk && digitsOk, formatted };
  }

  return { valid: PASSPORT_REGEX.test(v), incomplete: false, formatted };
}
