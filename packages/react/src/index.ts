// Re-exported so consumers of this package never need to separately
// `npm install @pk-validators/core` themselves — one install covers
// validators, hooks, and components.
export { validateCnic, formatCnic, validatePkPhone, validatePassport } from '@pk-validators/core';
export type { CnicResult, PhoneResult, PassportResult } from '@pk-validators/core';

export { useCnic } from './hooks/useCnic';
export { usePkPhone } from './hooks/usePkPhone';
export { usePassport } from './hooks/usePassport';
export { CnicInput } from './CnicInput';
export type { CnicInputProps } from './CnicInput';
export { PhoneInput } from './PhoneInput';
export type { PhoneInputProps } from './PhoneInput';
export { PassportInput } from './PassportInput';
export type { PassportInputProps } from './PassportInput';
