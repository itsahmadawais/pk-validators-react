import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { useCnic } from '../../hooks/useCnic';

/**
 * CNIC has no reachable "invalid" state (see the Overview page — real
 * CNICs have no checksum digit), so this example instead demonstrates the
 * other two things a custom UI typically wants from `useCnic`: a
 * progress-style hint while the user is still typing, and the derived
 * `gender` once the value is valid. It also shows deriving your own
 * message text instead of the hook's (English-only) `error` field — useful
 * if you need Urdu or any other custom copy.
 */

// Storybook's "Show code" panel defaults to the literal source of the
// `render: () => <CustomCnicCard />` line below, which is useless — the
// actual pattern lives inside CustomCnicCard. This string is shown instead
// via the `docs.source.code` parameter. Keep it in sync with the component
// below if you change it.
const SOURCE = `import { useCnic } from 'pk-validators-react';

function CustomCnicCard() {
  const cnic = useCnic();
  const digitsTyped = cnic.rawValue.replace(/\\D/g, '').length;
  const remaining = Math.max(0, 13 - digitsTyped);

  // Deriving our own message instead of using cnic.error (which is
  // English-only) — this is the pattern to follow for i18n'd custom UI.
  let message = null;
  if (cnic.isValid) {
    message = null; // gender badge covers this instead
  } else if (digitsTyped > 0) {
    message = \`\${remaining} more digit\${remaining === 1 ? '' : 's'} to go\`;
  }

  return (
    <div className="cnic-card">
      <div className="cnic-card__badge" data-gender={cnic.isValid ? cnic.gender : undefined}>
        {cnic.isValid ? (cnic.gender === 'male' ? '♂' : '♀') : 'ID'}
      </div>

      <input value={cnic.value} onChange={cnic.onChange} placeholder="35202-1234567-1" />

      {cnic.isValid ? (
        <span className="cnic-card__status">Looks good.</span>
      ) : (
        <span className="cnic-card__status">{message}</span>
      )}
    </div>
  );
}`;

const meta: Meta = {
  title: 'Guides/Custom UI/CNIC',
  parameters: {
    docs: {
      description: {
        component:
          'Card-style field built entirely from `useCnic()` — no `<CnicInput />` ' +
          'involved. Type digits to watch the progress hint count down, and ' +
          'finish 13 digits to see the gender badge appear.',
      },
      source: { code: SOURCE, language: 'tsx', type: 'code' },
    },
  },
};
export default meta;

type Story = StoryObj;

const DIGIT_COUNT = 13;

function CustomCnicCard() {
  const cnic = useCnic();
  const digitsTyped = cnic.rawValue.replace(/\D/g, '').length;
  const remaining = Math.max(0, DIGIT_COUNT - digitsTyped);

  // Deriving our own message instead of using cnic.error (which is
  // English-only) — this is the pattern to follow for i18n'd custom UI.
  let message: string | null = null;
  if (cnic.isValid) {
    message = null; // gender badge covers this instead
  } else if (digitsTyped > 0) {
    message = `${remaining} more digit${remaining === 1 ? '' : 's'} to go`;
  }

  return (
    <div
      style={{
        fontFamily: 'system-ui, sans-serif',
        maxWidth: 340,
        padding: 20,
        borderRadius: 16,
        background: '#fafafa',
        border: '1px solid #e5e5e5',
        boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
            fontWeight: 700,
            color: '#fff',
            background: cnic.isValid ? (cnic.gender === 'male' ? '#2563eb' : '#db2777') : '#9ca3af',
            transition: 'background 150ms',
          }}
        >
          {cnic.isValid ? (cnic.gender === 'male' ? '♂' : '♀') : 'ID'}
        </div>
        <div>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#111' }}>National ID</div>
          <div style={{ fontSize: 11, color: '#888' }}>
            {cnic.isValid ? `Detected: ${cnic.gender}` : 'Enter your 13-digit CNIC'}
          </div>
        </div>
      </div>

      <input
        value={cnic.value}
        onChange={cnic.onChange}
        placeholder="35202-1234567-1"
        aria-label="CNIC"
        style={{
          width: '100%',
          boxSizing: 'border-box',
          padding: '10px 12px',
          borderRadius: 8,
          border: `1.5px solid ${cnic.isValid ? '#16a34a' : '#d1d5db'}`,
          outline: 'none',
          fontSize: 15,
          background: '#fff',
        }}
      />

      <div style={{ marginTop: 6, fontSize: 12, minHeight: 16, color: cnic.isValid ? '#16a34a' : '#888' }}>
        {cnic.isValid ? 'Looks good.' : message}
      </div>
    </div>
  );
}

export const Default: Story = {
  render: () => <CustomCnicCard />,
};
