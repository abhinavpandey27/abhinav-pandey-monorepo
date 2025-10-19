import type { CollectionConfig } from 'payload';

const PASSWORD_MIN_LENGTH = Number(process.env.AUTH_PASSWORD_MIN_LENGTH ?? 12);
const AUTH_MAX_LOGIN_ATTEMPTS = Number(process.env.AUTH_MAX_LOGIN_ATTEMPTS ?? 5);
const AUTH_LOCK_TIME = Number(process.env.AUTH_LOCK_TIME ?? 10 * 60 * 1000);
const AUTH_TOKEN_EXPIRATION = Number(process.env.AUTH_TOKEN_EXPIRATION ?? 60 * 60 * 2);
const AUTH_ENABLE_EMAIL_VERIFICATION =
  (process.env.AUTH_ENABLE_EMAIL_VERIFICATION ?? 'false').toLowerCase() === 'true';
const AUTH_ALLOWED_EMAIL_DOMAINS = (process.env.AUTH_ALLOWED_EMAIL_DOMAINS ?? '')
  .split(',')
  .map((domain) => domain.trim().toLowerCase())
  .filter(Boolean);

const isEmailAllowed = (email?: string | null): boolean => {
  if (!email) return false;
  if (AUTH_ALLOWED_EMAIL_DOMAINS.length === 0) return true;
  const domain = email.split('@').pop()?.toLowerCase();
  return !!domain && AUTH_ALLOWED_EMAIL_DOMAINS.includes(domain);
};

export const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    depth: 1,
    maxLoginAttempts: Number.isFinite(AUTH_MAX_LOGIN_ATTEMPTS)
      ? AUTH_MAX_LOGIN_ATTEMPTS
      : undefined,
    lockTime: Number.isFinite(AUTH_LOCK_TIME) ? AUTH_LOCK_TIME : undefined,
    tokenExpiration: Number.isFinite(AUTH_TOKEN_EXPIRATION)
      ? AUTH_TOKEN_EXPIRATION
      : undefined,
    verify: AUTH_ENABLE_EMAIL_VERIFICATION,
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
  hooks: {
    beforeValidate: [
      ({ data }) => {
        const password = data?.password;
        if (password && password.length < PASSWORD_MIN_LENGTH) {
          throw new Error(
            `Password must be at least ${PASSWORD_MIN_LENGTH} characters long.`,
          );
        }

        const email = data?.email;
        if (email && !isEmailAllowed(email)) {
          throw new Error('Email domain is not allowlisted for admin access.');
        }

        return data;
      },
    ],
    beforeChange: [
      ({ data, originalDoc }) => {
        const email = data?.email ?? originalDoc?.email;
        if (email && !isEmailAllowed(email)) {
          throw new Error('Email domain is not allowlisted for admin access.');
        }
        return data;
      },
    ],
    beforeOperation: [
      ({ args, operation }) => {
        if (operation === 'login') {
          const email =
            typeof args?.data?.email === 'string' ? args.data.email.toLowerCase() : null;
          if (!isEmailAllowed(email ?? undefined)) {
            throw new Error('Email domain is not allowlisted for admin access.');
          }
        }

        return args;
      },
    ],
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
