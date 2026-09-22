export interface PhoneResult {
  valid: boolean;
  incomplete: boolean;
  /** Local 11-digit format, e.g. "0300-1234567" */
  formatted: string;
  /** E.164 format, e.g. "+923001234567". Only set when valid. */
  e164?: string;
  /** Best-effort carrier guess. See CARRIER_RANGES note below. */
  carrier?: string;
}

/**
 * Best-effort prefix -> carrier map. Operators occasionally get new number
 * ranges reassigned by PTA, so this table needs periodic review — do not
 * treat it as authoritative for anything compliance-sensitive.
 */
const CARRIER_RANGES: Array<{ prefixes: string[]; carrier: string }> = [
  { prefixes: ['300', '301', '302', '303', '304', '305', '306', '307', '308', '309', '320', '321', '322', '323', '324', '325', '326', '327', '328', '329'], carrier: 'Jazz' },
  { prefixes: ['310', '311', '312', '313', '314', '315', '316', '317', '318', '319'], carrier: 'Zong' },
  { prefixes: ['330', '331', '332', '333', '334', '335', '336', '337', '338', '339'], carrier: 'Ufone' },
  { prefixes: ['340', '341', '342', '343', '344', '345', '346', '347', '348', '349'], carrier: 'Telenor' },
  { prefixes: ['355'], carrier: 'SCOM' },
];

function digitsOnly(input: string): string {
  let d = (input ?? '').replace(/\D/g, '');
  // normalize a leading country code (92) to local 0-prefixed form
  if (d.startsWith('92')) d = '0' + d.slice(2);
  if (!d.startsWith('0') && d.length > 0) d = '0' + d;
  return d.slice(0, 11);
}

function guessCarrier(threeDigitPrefix: string): string | undefined {
  return CARRIER_RANGES.find((r) => r.prefixes.includes(threeDigitPrefix))?.carrier;
}

export function formatPkPhone(input: string): string {
  const d = digitsOnly(input);
  const part1 = d.slice(0, 4);
  const part2 = d.slice(4, 11);
  return part2 ? `${part1}-${part2}` : part1;
}

export function validatePkPhone(input: string): PhoneResult {
  const d = digitsOnly(input);
  const formatted = formatPkPhone(input);

  if (d.length === 0) {
    return { valid: false, incomplete: true, formatted };
  }

  const validPrefix = d.length >= 2 ? d[1] === '3' : true; // must be 03xxxxxxxxx
  if (!validPrefix) {
    return { valid: false, incomplete: false, formatted };
  }

  if (d.length < 11) {
    return { valid: false, incomplete: true, formatted };
  }

  const threeDigitPrefix = d.slice(1, 4);
  const e164 = `+92${d.slice(1)}`;
  const carrier = guessCarrier(threeDigitPrefix);

  return { valid: true, incomplete: false, formatted, e164, carrier };
}
