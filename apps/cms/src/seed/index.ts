import payload from 'payload';

// @ts-expect-error Payload config path is resolved at runtime by tsx
import payloadConfig from '../../payload.config.ts';

const SEED_ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL ?? 'admin@example.com';
const SEED_ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD ?? 'change-me-now';
const SEED_ADMIN_NAME = process.env.SEED_ADMIN_NAME ?? 'Portfolio Admin';
const SEED_ADMIN_ROLE = process.env.SEED_ADMIN_ROLE ?? 'admin';

const ensureAdminUser = async () => {
  const existing = await payload.find({
    collection: 'users',
    where: {
      email: {
        equals: SEED_ADMIN_EMAIL.toLowerCase(),
      },
    },
    depth: 0,
    limit: 1,
  });

  if (existing.totalDocs > 0) {
    payload.logger.info(
      `Seed: admin user (${SEED_ADMIN_EMAIL}) already exists. Skipping creation.`,
    );
    return existing.docs[0];
  }

  payload.logger.info(`Seed: creating admin user (${SEED_ADMIN_EMAIL}).`);

  const user = await payload.create({
    collection: 'users',
    data: {
      email: SEED_ADMIN_EMAIL,
      password: SEED_ADMIN_PASSWORD,
      name: SEED_ADMIN_NAME,
      role: SEED_ADMIN_ROLE,
    },
  });

  return user;
};

const run = async () => {
  await payload.init({
    config: payloadConfig,
    onInit: async () => {
      payload.logger.info('Seed: Payload CMS initialised');
    },
  });

  try {
    await ensureAdminUser();
    // TODO: Add project/about/site config seeders once collections are defined.
  } finally {
    payload.logger.info('Seed: completed');
  }
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error('Seed script failed:', error);
  process.exit(1);
});
