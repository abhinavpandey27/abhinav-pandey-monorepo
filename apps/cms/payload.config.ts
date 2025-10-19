import 'dotenv/config';
import { buildConfig } from 'payload';
import { postgresAdapter } from '@payloadcms/db-postgres';
import { s3Storage } from '@payloadcms/storage-s3';
import { Users } from './src/collections/Users.js';
import { Media } from './src/collections/Media.js';

const databaseURL =
  process.env.DATABASE_URL || 'postgres://postgres:postgres@localhost:5432/portfolio_cms';

const serverURL = process.env.SERVER_URL || 'http://localhost:3000';
const r2AccountId = process.env.R2_ACCOUNT_ID;
const r2Bucket = process.env.R2_BUCKET_NAME || 'portfolio-media';
const r2AccessKey = process.env.R2_ACCESS_KEY_ID;
const r2Secret = process.env.R2_SECRET_ACCESS_KEY;
const r2PublicBase = process.env.R2_PUBLIC_BASE_URL;
const r2Endpoint =
  process.env.R2_ENDPOINT ||
  (r2AccountId ? `https://${r2AccountId}.r2.cloudflarestorage.com` : undefined);

const storagePlugin =
  r2Endpoint && r2AccessKey && r2Secret
    ? s3Storage({
        bucket: r2Bucket,
        config: {
          endpoint: r2Endpoint,
          region: 'auto',
          credentials: {
            accessKeyId: r2AccessKey,
            secretAccessKey: r2Secret,
          },
          forcePathStyle: true,
        },
        collections: {
          media: {
            generateFileURL: ({ filename }) => {
              const base = (r2PublicBase || `${r2Endpoint}/${r2Bucket}`).replace(
                /\/+$/,
                '',
              );
              return `${base}/${filename}`;
            },
          },
        },
      })
    : undefined;

export default buildConfig({
  serverURL,
  secret: process.env.PAYLOAD_SECRET || 'development-secret',
  admin: {
    user: Users.slug,
  },
  collections: [Users, Media],
  db: postgresAdapter({
    pool: {
      connectionString: databaseURL,
    },
  }),
  plugins: storagePlugin ? [storagePlugin] : [],
  typescript: {
    outputFile: './payload-types.ts',
  },
  graphQL: {
    disable: false,
  },
});
