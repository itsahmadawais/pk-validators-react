# @pk-validators/core

**[GitHub](https://github.com/itsahmadawais/pk-validators-react)**

Zero-dependency validation and formatting for Pakistani data formats: CNIC,
mobile phone numbers, and passport numbers. Works anywhere JavaScript runs —
no React required.

Using this with React? See [pk-validators-react](https://www.npmjs.com/package/pk-validators-react)
and its [live demo](https://pk-validators-react.vercel.app) instead — it
re-exports everything here plus hooks, masked input components, and
Zod/RHF resolvers.

## Install

```bash
npm install @pk-validators/core
```

## Usage

```ts
import { validateCnic, formatCnic, validatePkPhone, validatePassport } from '@pk-validators/core';

validateCnic('3520212345671');
// { valid: true, incomplete: false, formatted: '35202-1234567-1', gender: 'male' }

validateCnic('35202'); // still typing
// { valid: false, incomplete: true, formatted: '35202' }

formatCnic('352021234'); // '35202-1234'

validatePkPhone('03001234567');
// { valid: true, incomplete: false, formatted: '0300-1234567', e164: '+923001234567', carrier: 'Jazz' }

validatePassport('AB1234567');
// { valid: true, incomplete: false, formatted: 'AB1234567' }
```

Every validator returns `{ valid, incomplete, formatted, ...extras }`.
`incomplete` is always distinct from `valid` — a user who has typed 5 of 13
CNIC digits is *incomplete*, not *invalid*, so you can avoid flashing an
error on keystroke one.

## What's intentionally not here

- **CNIC province/district decoding.** The last-digit gender rule
  (odd = male, even = female) is well established and implemented, but the
  full province/district prefix table is not — it needs to be sourced from
  an authoritative NADRA reference before shipping, rather than guessed.
- **Carrier ranges and the passport format** are both best-effort /
  community-sourced and flagged as such in the source comments
  (`src/phone.ts`, `src/passport.ts`) — reconfirm against PTA/DGIP sources
  before relying on them in anything compliance-sensitive.

## License

MIT
