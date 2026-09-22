import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CnicInput } from '../CnicInput';

const meta: Meta<typeof CnicInput> = {
  title: 'Inputs/CNIC Input',
  component: CnicInput,
  argTypes: {
    locale: { control: 'radio', options: ['en', 'ur'] },
  },
};
export default meta;

type Story = StoryObj<typeof CnicInput>;

function Wrapper(props: React.ComponentProps<typeof CnicInput>) {
  const [value, setValue] = useState(props.value ?? '');
  return <CnicInput {...props} value={value} onChange={setValue} />;
}

export const Empty: Story = {
  render: (args) => <Wrapper {...args} value="" />,
};

export const WhileTyping: Story = {
  render: (args) => <Wrapper {...args} value="352021234" />,
};

export const Valid: Story = {
  render: (args) => <Wrapper {...args} value="3520212345671" />,
};

export const Incomplete: Story = {
  // Note: real CNICs have no checksum digit, so a "complete but invalid"
  // state doesn't apply here the way it does for phone/passport — an
  // incomplete entry is the only non-valid state this validator produces.
  render: (args) => <Wrapper {...args} value="1234" />,
};

export const Urdu: Story = {
  render: (args) => <Wrapper {...args} value="abc" locale="ur" />,
};
