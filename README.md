# pk-validators-react

React hooks, masked input components, and Zod/react-hook-form resolvers for
validating Pakistani **CNIC**, **mobile phone**, and **passport** numbers —
in English and Urdu.

Most validators for these fields stop at "pass a string, get back
true/false." This one focuses on the React UX layer instead: live-masking
inputs, hooks that expose validity as you type (distinguishing "still
typing" from "actually invalid," so you never flash an error on the first
keystroke), and form-library resolvers.

## Install

```bash
npm install pk-validators-react
```

That's the only install you need for components, hooks, and validators. If
you also want the Zod/`react-hook-form` resolvers:

```bash
npm install pk-validators-react zod react-hook-form
```

## Quick start

### Drop-in components

```tsx
import { useState } from 'react';
import { CnicInput, PhoneInput, PassportInput } from 'pk-validators-react';

function ProfileForm() {
  const [cnic, setCnic] = useState('');
  const [phone, setPhone] = useState('');

  return (
    <form>
      <CnicInput value={cnic} onChange={setCnic} locale="en" />
      <PhoneInput value={phone} onChange={setPhone} locale="ur" />
    </form>
  );
}
```

Both format the value as you type, forward standard `<input>` props, and
set `aria-invalid`/`aria-describedby` correctly.

### Your own UI

Prefer your own markup? Use the underlying hooks — same validation logic,
zero opinions about rendering:

```tsx
import { useCnic } from 'pk-validators-react';

function CustomCnicField() {
  const cnic = useCnic();
  return (
    <div>
      <input value={cnic.value} onChange={cnic.onChange} />
      {cnic.gender && <span>Detected: {cnic.gender}</span>}
    </div>
  );
}
```

### react-hook-form + Zod

```tsx
import { useForm } from 'react-hook-form';
import { pkResolver } from 'pk-validators-react/resolvers';

const { register, formState } = useForm({
  resolver: pkResolver({ cnic: true, phone: true }),
});
```

## Documentation

Full API reference and live examples (every component's empty/typing/
valid/invalid states, both locales, plus custom-UI examples for all three
fields) are in Storybook:

```bash
git clone https://github.com/itsahmadawais/pk-validators-react
cd pk-validators-react && npm install && npm run storybook
```

## Packages

| Package | Install this if... |
|---|---|
| **`pk-validators-react`** | You're building a React app. Components, hooks, validators, and Zod/RHF resolvers (via a subpath) — one install. |
| `@pk-validators/core` | You need the validators outside React (e.g. server-side) — zero dependencies. Not needed alongside `pk-validators-react`; it's already included. |

## Known limitations

- CNIC validation only checks structure (13 digits) and the well-established
  last-digit gender rule — province/district decoding isn't implemented.
- The passport number format and phone carrier-prefix ranges are
  best-effort, not confirmed against authoritative DGIP/PTA sources. See
  the source comments in `packages/core/src` before relying on either for
  anything compliance-sensitive.

## Development

```bash
npm install
npm run build
npm test
```

## License

MIT

---

Made with ♥ by [itsahmadawais](https://github.com/itsahmadawais)
