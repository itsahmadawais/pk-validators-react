export interface CnicResult {
  /** True only when the input is a complete, structurally valid 13-digit CNIC. */
  valid: boolean;
  /** True while the input could still become valid (fewer than 13 digits so far). */
  incomplete: boolean;
  /** Dash-formatted value, e.g. "35202-1234567-1". Present once >=1 digit typed. */
  formatted: string;
  /** Last-digit parity rule: odd = male, even = female. Only set when valid. */
  gender?: 'male' | 'female';
}

/**
 * NOTE: This does NOT decode province/district from the CNIC prefix.
 * That table needs to be sourced from an authoritative NADRA reference
 * before shipping — do not fabricate it. This module only validates
 * structure (13 digits) and extracts the well-established gender rule
 * (last digit odd = male, even = female).
 */

function digitsOnly(input: string): string {
  return (input ?? '').replace(/\D/g, '').slice(0, 13);
}

export function formatCnic(input: string): string {
  const d = digitsOnly(input);
  const part1 = d.slice(0, 5);
  const part2 = d.slice(5, 12);
  const part3 = d.slice(12, 13);
  let out = part1;
  if (part2) out += `-${part2}`;
  if (part3) out += `-${part3}`;
  return out;
}

export function validateCnic(input: string): CnicResult {
  const d = digitsOnly(input);
  const formatted = formatCnic(input);

  if (d.length === 0) {
    return { valid: false, incomplete: true, formatted };
  }

  if (d.length < 13) {
    return { valid: false, incomplete: true, formatted };
  }

  // exactly 13 digits at this point
  const lastDigit = Number(d[12]);
  const gender: 'male' | 'female' = lastDigit % 2 === 0 ? 'female' : 'male';

  return { valid: true, incomplete: false, formatted, gender };
}
