import 'dotenv/config';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { Users } from './src/collections/Users.js';

const databaseURL =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/portfolio_cms';

const serverURL = process.env.SERVER_URL || 'http://localhost:3000';

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET || 'development-secret',
  admin: {
    user: Users.slug,
  },
  collections: [Users],
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
  }),
  typescript: {
    outputFile: './payload-types.ts',
  },
  graphQL: {
    disable: false,
  },
});
