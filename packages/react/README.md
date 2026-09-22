# pk-validators-react

**[Live Demo & Docs](https://pk-validators-react.vercel.app)** · **[GitHub](https://github.com/itsahmadawais/pk-validators-react)**

React hooks, masked controlled input components, and (via a subpath) Zod +
`react-hook-form` resolvers for Pakistani CNIC, mobile phone, and passport
numbers. **One package** — validators are re-exported from
`@pk-validators/core` internally, so you never need to install that
separately.

## Install

```bash
npm install pk-validators-react
```

React `>=18` is a peer dependency. `zod` and `react-hook-form` are optional
peer dependencies, only needed if you import `pk-validators-react/resolvers`.

## Components

```tsx
import { CnicInput, PhoneInput, PassportInput } from 'pk-validators-react';
import { useState } from 'react';

function Form() {
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <>
      <CnicInput value={cnic} onChange={setCnic} locale="en" />
      <PhoneInput value={phone} onChange={setPhone} locale="ur" />
      <PassportInput value="" onChange={() => {}} />
    </>
  );
}
```

All three forward standard `<input>` props, set `aria-invalid` and
`aria-describedby` correctly, mask/format the value live as the user types,
and accept a `locale="en" | "ur"` prop for bilingual hint/error text.

## Hooks

```tsx
import { useCnic, usePkPhone, usePassport } from 'pk-validators-react';

const cnic = useCnic();
// { value, rawValue, formatted, onChange, isValid, isComplete, gender, error }

const phone = usePkPhone();
// { value, rawValue, formatted, onChange, isValid, isComplete, e164, carrier, error }
```

`isComplete` is `true` once enough characters have been entered to make a
final valid/invalid determination — it's `false`, not an error, while the
user is still mid-input.

## Plain validator functions

Re-exported from `@pk-validators/core` for non-input use (validating on
submit, server actions, etc.):

```ts
import { validateCnic, validatePkPhone, validatePassport } from 'pk-validators-react';
```

## Zod schemas + react-hook-form resolver

```tsx
import { pkResolver, pkCnicSchema } from 'pk-validators-react/resolvers';
import { useForm } from 'react-hook-form';

const { register, formState } = useForm({
  resolver: pkResolver({ cnic: true, phone: true }),
});
```

Requires `zod` and (for `pkResolver`) `react-hook-form` installed —
see the root README for details.

## Storybook

```bash
npm run storybook          # dev server, localhost:6006
npm run build-storybook    # static site → storybook-static/
```

Includes a "Getting Started" Introduction page plus stories covering empty,
while-typing, valid, invalid, and both locales for every component.

## License

MIT
