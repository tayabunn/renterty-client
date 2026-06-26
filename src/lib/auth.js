import { clsx } from "clsx";
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

import { betterAuth } from "better-auth";
// Trigger watch reload to pick up new env credentials
import { MongoClient } from "mongodb";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { bearer } from "better-auth/plugins";
import dns from "dns";

dns.setServers(['8.8.8.8', '1.1.1.1']);

const client = new MongoClient(process.env.MONGODB_URI);
const db = client.db(process.env.DB_NAME);

export const auth = betterAuth({
  database: mongodbAdapter(db, {
    // Optional: if you don't provide a client, database transactions won't be enabled.
    client,
    collectionNames: {
      user: "users",
      session: "sessions",
      account: "accounts",
      verification: "verifications",
    },
  }),
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || 'placeholder-google-client-id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder-google-client-secret',
    },
  },
  plugins: [
    bearer(),
  ],
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: 'Tenant',
      },
      isBlocked: {
        type: "boolean",
        defaultValue: false,
      }
    },
  },
});