import { z } from 'zod';
import { validateCnic, validatePkPhone, validatePassport } from '@pk-validators/core';

export const pkCnicSchema = z
  .string()
  .refine((v) => validateCnic(v).valid, { message: 'Invalid CNIC number' });

export const pkPhoneSchema = z
  .string()
  .refine((v) => validatePkPhone(v).valid, { message: 'Invalid mobile number' });

export const pkPassportSchema = z
  .string()
  .refine((v) => validatePassport(v).valid, { message: 'Invalid passport number' });
