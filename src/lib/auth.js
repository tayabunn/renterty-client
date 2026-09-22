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

if (typeof dns !== 'undefined' && typeof dns.setServers === 'function') {
  try {
    dns.setServers(['8.8.8.8', '1.1.1.1']);
  } catch (e) {}
}

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://localhost:27017/renterty';
const client = new MongoClient(mongoUri);
const db = client.db(process.env.DB_NAME || 'renterty');

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