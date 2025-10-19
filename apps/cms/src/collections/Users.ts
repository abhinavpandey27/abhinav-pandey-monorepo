import type { CollectionConfig } from 'payload';

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 1,
    cookies: {
      secure:
        process.env.NODE_ENV === 'production' &&
        !!process.env.SERVER_URL?.startsWith('https'),
    },
  },
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'lastLogin', 'updatedAt'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: false,
    },
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'admin',
      options: [
        { label: 'Admin', value: 'admin' },
        { label: 'Editor', value: 'editor' },
      ],
    },
  ],
};
