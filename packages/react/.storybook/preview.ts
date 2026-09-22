import type { Preview } from '@storybook/react';

const preview: Preview = {
  parameters: {
    controls: { expanded: true },
    layout: 'centered',
    options: {
      storySort: {
        order: [
          'Introduction',
          'Inputs',
          ['CNIC Input', 'Phone Input', 'Passport Input'],
          'Guides',
          ['Custom UI', ['Overview', 'CNIC', 'Phone', 'Passport']],
        ],
      },
    },
  },
};

export default preview;
