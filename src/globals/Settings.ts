import { GlobalConfig } from 'payload'

export const Settings: GlobalConfig = {
  slug: 'settings',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'whatsapp',
      label: 'WhatsApp Notifications',
      type: 'group',
      fields: [
        {
          name: 'sendConfirmation',
          label: 'Send Automatic WhatsApp Confirmation',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'If checked, a WhatsApp confirmation will be sent automatically after a successful booking.',
          },
        },
      ],
    },
  ],
}
